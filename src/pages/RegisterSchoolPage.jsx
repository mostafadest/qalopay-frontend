
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { School, Mail, Phone, MapPin, Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const RegisterSchoolPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    school_name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const selectedPlanSlug = searchParams.get('plan') || 'basic';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1. Auth SignUp
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password
      );

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");

      const userId = authData.user.id;

      // 2. Create School Record
      // Calculate Trial End Date (7 days from now)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert([{
          name: formData.school_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          owner_id: userId,
          subscription_status: 'trial',
          trial_end: trialEnd.toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (schoolError) throw new Error("فشل إنشاء سجل المدرسة: " + schoolError.message);
      
      // 3. Create initial subscription record (optional but good for data integrity)
      // Fetch plan ID based on selection or default
      const { data: plans } = await supabase
        .from('plans')
        .select('id')
        .ilike('name', `%${selectedPlanSlug === 'enterprise' ? 'business' : selectedPlanSlug}%`)
        .limit(1);
      
      let planId = plans && plans.length > 0 ? plans[0].id : null;
      
      // If plan not found by slug, get first available plan
      if (!planId) {
         const { data: defaultPlan } = await supabase.from('plans').select('id').limit(1);
         planId = defaultPlan?.[0]?.id;
      }

      if (planId && schoolData?.id) {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        await supabase
          .from('subscriptions')
          .insert([{
            school_id: schoolData.id,
            plan_id: planId,
            start_date: today.toISOString(),
            end_date: nextWeek.toISOString(),
            subscription_status: 'trial',
            billing_cycle: 'monthly',
            price: 0,
            is_paid: false,
            activated_by: userId
          }]);
      }

      toast({
        title: "تم التسجيل بنجاح! 🎉",
        description: "تم إنشاء حساب المدرسة وبدء الفترة التجريبية.",
        className: "bg-green-50 text-green-900 border-green-200"
      });

      // Redirect directly to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error("Registration Error:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ غير متوقع."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل مدرسة جديدة - QaloPay</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-dark-purple via-[#4c3290] to-indigo-900 py-12 px-4 font-body flex items-center justify-center" dir="rtl">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          <div className="md:w-5/12 bg-gradient-to-br from-dark-purple to-indigo-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="relative z-10">
               <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
                 <img src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/q-logo-for-color-background-iXZQm.png" alt="QaloPay" className="h-10 w-auto brightness-0 invert" />
               </Link>
               <h2 className="text-3xl font-bold font-heading mb-4 leading-tight">ابدأ رحلتك الرقمية مع QaloPay</h2>
               <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                 انضم إلى مئات المدارس التي تثق بنا لإدارة شؤونها المالية.
               </p>
               
               <div className="space-y-4">
                 {['لوحة تحكم شاملة', 'نظام فواتير ذكي', 'تقارير مالية دقيقة'].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                       <CheckCircle size={14} />
                     </div>
                     <span className="text-sm font-medium">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div className="md:w-7/12 p-8 md:p-12 bg-white relative">
            <div className="absolute top-6 left-6">
              <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-dark-purple transition-colors text-sm font-bold">
                <ArrowLeft size={16} />
                العودة للرئيسية
              </Link>
            </div>

            <div className="mb-8 mt-4">
              <h1 className="text-2xl font-bold font-heading text-gray-800 mb-2">تسجيل حساب مدرسة جديد</h1>
              <p className="text-gray-500">أدخل بيانات مدرستك للبدء</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <School size={16} className="text-gold" />
                    اسم المدرسة
                  </label>
                  <input 
                    type="text" 
                    name="school_name" 
                    value={formData.school_name} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/10 outline-none transition-all" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-gold" />
                    رقم الهاتف
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/10 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-gold" />
                  العنوان
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/10 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-gold" />
                  البريد الإلكتروني
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/10 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-gold" />
                  كلمة المرور
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  minLength={6} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/10 outline-none transition-all" 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gold text-dark-purple py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    'إنشاء حساب'
                  )}
                </button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-gray-500 text-sm">
                  لديك حساب بالفعل؟ {' '}
                  <Link to="/login" className="text-dark-purple font-bold hover:underline">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSchoolPage;
