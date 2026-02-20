
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, DollarSign, School, CheckCircle2 } from 'lucide-react';

import SchoolsTable from '@/components/admin/SchoolsTable';
import SubscriptionsTable from '@/components/admin/SubscriptionsTable';
import QuickActions from '@/components/admin/QuickActions';
import AddSchoolModal from '@/components/admin/AddSchoolModal';
import AssignPlanModal from '@/components/admin/AssignPlanModal';
import ErrorAlert from '@/components/ErrorAlert';

const AdminDashboard = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubs: 0,
    trialSubs: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0
  });

  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isAssignPlanOpen, setIsAssignPlanOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
       navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Stats are now visible to any authenticated user accessing this route
        const { data: schools, error: schoolsError } = await supabase.from('schools').select('*');
        if (schoolsError) throw schoolsError;

        const { data: subs, error: subsError } = await supabase.from('subscriptions').select('*');
        if (subsError) throw subsError;

        const totalSchools = schools.length;
        const activeSubs = schools.filter(s => s.subscription_status === 'active').length;
        const trialSubs = schools.filter(s => s.subscription_status === 'trial').length;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let monthlyRev = 0;
        let yearlyRev = 0;

        subs.forEach(sub => {
           if (sub.price && sub.start_date) {
               const subDate = new Date(sub.start_date);
               if (subDate.getFullYear() === currentYear) {
                   yearlyRev += Number(sub.price);
                   if (subDate.getMonth() === currentMonth) {
                       monthlyRev += Number(sub.price);
                   }
               }
           }
        });

        setStats({
          totalSchools,
          activeSubs,
          trialSubs,
          monthlyRevenue: monthlyRev,
          yearlyRevenue: yearlyRev
        });

      } catch (err) {
        setError("فشل تحميل الإحصائيات: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
        fetchStats();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <>
      <Helmet>
        <title>QaloPay - لوحة الإدارة</title>
      </Helmet>
      
      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
        <nav className="bg-gradient-to-r from-dark-purple to-indigo-900 text-white shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                 <LayoutDashboard size={24} className="text-gold" />
              </div>
              <div>
                 <h1 className="text-xl font-bold font-heading leading-tight">QaloPay Admin</h1>
                 <p className="text-xs text-gray-300 font-normal">لوحة التحكم المركزية</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-red-500/20 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold flex items-center gap-2 border border-white/10 hover:border-red-500/50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </nav>

        <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 space-y-12">
          
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                   <School className="text-blue-500" />
                   <span className="text-gray-500 font-bold text-sm">إجمالي المدارس</span>
                </div>
                <h3 className="text-2xl font-bold">{loading ? '...' : stats.totalSchools}</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                   <CheckCircle2 className="text-green-500" />
                   <span className="text-gray-500 font-bold text-sm">اشتراكات نشطة</span>
                </div>
                <h3 className="text-2xl font-bold">{loading ? '...' : stats.activeSubs}</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center gap-3 mb-2">
                   <Settings className="text-amber-500" />
                   <span className="text-gray-500 font-bold text-sm">فترة تجريبية</span>
                </div>
                <h3 className="text-2xl font-bold">{loading ? '...' : stats.trialSubs}</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center gap-3 mb-2">
                   <DollarSign className="text-purple-500" />
                   <span className="text-gray-500 font-bold text-sm">دخل الشهر</span>
                </div>
                <h3 className="text-2xl font-bold">{loading ? '...' : stats.monthlyRevenue.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center gap-3 mb-2">
                   <DollarSign className="text-indigo-500" />
                   <span className="text-gray-500 font-bold text-sm">دخل السنة</span>
                </div>
                <h3 className="text-2xl font-bold">{loading ? '...' : stats.yearlyRevenue.toLocaleString()}</h3>
             </div>
          </section>

          <section>
             <h2 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-gold pr-4">إجراءات سريعة</h2>
             <QuickActions 
               onAddSchool={() => setIsAddSchoolOpen(true)}
               onAssignPlan={() => setIsAssignPlanOpen(true)}
             />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-gold pr-4">إدارة المدارس</h2>
            <SchoolsTable />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-gold pr-4">إدارة الاشتراكات والأسعار</h2>
            <SubscriptionsTable />
          </section>
        </main>
      </div>

      <AddSchoolModal 
        isOpen={isAddSchoolOpen} 
        onClose={() => setIsAddSchoolOpen(false)} 
        onSuccess={() => window.location.reload()}
      />
      <AssignPlanModal 
        isOpen={isAssignPlanOpen} 
        onClose={() => setIsAssignPlanOpen(false)} 
        onSuccess={() => window.location.reload()}
      />
    </>
  );
};

export default AdminDashboard;
