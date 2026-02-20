
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, CreditCard, AlertCircle, FileText, School, Calendar, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ErrorAlert from '@/components/ErrorAlert';

const Dashboard = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState(null);
  const [data, setData] = useState({
    students: 0,
    invoices: 0,
    totalPayments: 0,
    overdue: 0,
    lastInvoices: [],
    chartData: []
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        if (!currentUser) return; // Should be handled by ProtectedRoute, but safe check

        // Fetch School owned by current user
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*')
          .eq('owner_id', currentUser.id)
          .single();

        if (schoolError) {
          if (schoolError.code === 'PGRST116') { // Not found
             // User has account but no school record
             setError("No school found for this account. Please contact support.");
          } else {
             throw schoolError;
          }
          setLoading(false);
          return;
        }

        setSchool(schoolData);
        
        // Mock data for dashboard visuals since tables might be empty
        // In a real app, we would query related tables
        setData({
           students: 120,
           invoices: 45,
           totalPayments: 15600,
           overdue: 5,
           lastInvoices: [
             { id: 1, amount: 500, status: 'paid', due_date: '2023-10-01', student: { full_name: 'Ahmed Ali' } },
             { id: 2, amount: 750, status: 'pending', due_date: '2023-10-15', student: { full_name: 'Sarah Mohamed' } },
           ],
           chartData: [
             { name: 'Jan', amount: 4000 },
             { name: 'Feb', amount: 3000 },
             { name: 'Mar', amount: 2000 },
             { name: 'Apr', amount: 2780 },
             { name: 'May', amount: 1890 },
             { name: 'Jun', amount: 2390 },
           ]
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [currentUser]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <Loader2 className="animate-spin text-dark-purple h-10 w-10" />
        </div>
     );
  }

  if (!school) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-body" dir="rtl">
           <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold mb-4 text-gray-800">تنبيه</h2>
             <p className="text-gray-600 mb-6">{error || "لا توجد مدرسة مرتبطة بهذا الحساب"}</p>
             <button 
               onClick={handleLogout} 
               className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold transition-colors"
             >
               تسجيل الخروج
             </button>
           </div>
        </div>
     );
  }

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - {school.name}</title>
      </Helmet>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
        {/* Dashboard Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-dark-purple rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                 Q
               </div>
               <div>
                 <h1 className="text-xl font-bold font-heading text-dark-purple">{school.name}</h1>
                 <p className="text-xs text-gray-500 flex items-center gap-1">
                   <span className={`w-2 h-2 rounded-full ${school.subscription_status === 'active' || school.subscription_status === 'trial' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   {school.subscription_status === 'trial' ? 'فترة تجريبية' : 'نشط'}
                 </p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <User size={14} />
                <span>{currentUser.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all text-sm font-bold border border-red-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-dark-purple to-indigo-800 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading mb-2">مرحباً بك في لوحة تحكم مدرستك</h2>
              <p className="text-indigo-100 max-w-2xl">
                هنا يمكنك متابعة أداء مدرستك المالي، إدارة الطلاب، ومتابعة الفواتير.
                ينتهي الاشتراك التجريبي في: <span className="font-bold text-gold">{new Date(school.trial_end).toLocaleDateString('ar-EG')}</span>
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 w-12 h-12 flex items-center justify-center rounded-xl text-indigo-600 mb-4"><GraduationCap size={24} /></div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{data.students}</h3>
                <p className="text-gray-500 text-sm">عدد الطلاب</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 w-12 h-12 flex items-center justify-center rounded-xl text-emerald-600 mb-4"><CreditCard size={24} /></div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{data.totalPayments.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm">إجمالي المدفوعات (ر.س)</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-xl text-blue-600 mb-4"><FileText size={24} /></div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{data.invoices}</h3>
                <p className="text-gray-500 text-sm">عدد الفواتير</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-xl text-red-600 mb-4"><AlertCircle size={24} /></div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{data.overdue}</h3>
                <p className="text-gray-500 text-sm">فواتير متأخرة</p>
             </div>
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-dark-purple" />
                  تحليل المدفوعات الشهرية
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.chartData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         />
                         <Bar dataKey="amount" fill="#5B3FA6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-dark-purple" />
                  أحدث الفواتير
                </h3>
                <div className="space-y-4">
                   {data.lastInvoices.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">لا توجد فواتير حديثة</p>
                   ) : (
                      data.lastInvoices.map(inv => (
                         <div key={inv.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-default">
                            <div>
                               <p className="font-bold text-gray-800 text-sm">{inv.student?.full_name || 'طالب غير معروف'}</p>
                               <p className="text-xs text-gray-500">{inv.due_date}</p>
                            </div>
                            <div className="text-left">
                               <p className="font-bold text-indigo-600 text-sm">{inv.amount} ر.س</p>
                               <span className={`text-[10px] px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {inv.status}
                               </span>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
