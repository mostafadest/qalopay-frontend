
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { School, Mail, Phone, MapPin, Loader2, Save, ArrowRight } from 'lucide-react';

const AdminCreateSchoolPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

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
      const { error } = await supabase
        .from('schools')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          subscription_status: 'inactive',
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "تم إضافة المدرسة بنجاح",
        description: "تم إنشاء سجل المدرسة في النظام.",
        className: "bg-green-50 text-green-900 border-green-200",
      });

      setTimeout(() => {
        navigate('/admin');
      }, 1000);

    } catch (error) {
      console.error("Error creating school:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      <Helmet>
        <title>إضافة مدرسة جديدة - لوحة الإدارة</title>
      </Helmet>

      <div className="bg-dark-purple text-white py-6 px-4 mb-8 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
           <button 
             onClick={() => navigate('/admin')}
             className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
           >
             <ArrowRight size={20} />
           </button>
           <h1 className="text-2xl font-bold font-heading">إضافة مدرسة جديدة يدوياً</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                 <School size={20} />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-800">بيانات المدرسة</h2>
                 <p className="text-sm text-gray-500">أدخل البيانات الأساسية للمدرسة</p>
               </div>
             </div>
           </div>
           
           <form onSubmit={handleSubmit} className="p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-gray-700">اسم المدرسة</label>
                 <div className="relative">
                   <School className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 outline-none"
                   />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
                 <div className="relative">
                   <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 outline-none"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-semibold text-gray-700">رقم الهاتف</label>
                 <div className="relative">
                   <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input
                     type="tel"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 outline-none"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-semibold text-gray-700">العنوان</label>
                 <div className="relative">
                   <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input
                     type="text"
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 outline-none"
                   />
                 </div>
               </div>
             </div>

             <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
               <button
                 type="button"
                 onClick={() => navigate('/admin')}
                 className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
               >
                 إلغاء
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                 <span>حفظ المدرسة</span>
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateSchoolPage;
