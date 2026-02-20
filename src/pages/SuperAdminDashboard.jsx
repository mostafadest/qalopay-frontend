
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Admin Components
import StatisticsCards from '@/components/admin/StatisticsCards';
import RevenueAnalytics from '@/components/admin/RevenueAnalytics';
import SubscriptionsTable from '@/components/admin/SubscriptionsTable';
import QuickActions from '@/components/admin/QuickActions';
import AddSchoolModal from '@/components/admin/AddSchoolModal';
import AssignPlanModal from '@/components/admin/AssignPlanModal';

const SuperAdminDashboard = () => {
  const { currentUser, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Modals State
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isAssignPlanOpen, setIsAssignPlanOpen] = useState(false);

  // Security Check
  useEffect(() => {
    if (!authLoading) {
      // Check if user is super_admin. If not, redirect.
      // Note: We check both role field and possible boolean flag just in case.
      if (!currentUser || (currentUser.role !== 'super_admin' && currentUser.is_super_admin !== true)) {
        navigate('/dashboard'); 
      }
    }
  }, [currentUser, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-dark-purple mb-4" />
        <p className="text-gray-500 font-body">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>QaloPay - لوحة الإدارة العليا</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
        {/* Top Navbar */}
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
            
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold">{currentUser.full_name || 'Super Admin'}</p>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-red-500/20 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold flex items-center gap-2 border border-white/10 hover:border-red-500/50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 space-y-12">
          
          {/* Section 1: Quick Actions */}
          <section>
             <h2 className="text-2xl font-bold text-gray-800 mb-6 font-heading border-r-4 border-gold pr-4">إجراءات سريعة</h2>
             <QuickActions 
               onAddSchool={() => setIsAddSchoolOpen(true)}
               onAssignPlan={() => setIsAssignPlanOpen(true)}
             />
          </section>

          {/* Section 2: Statistics */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-heading border-r-4 border-gold pr-4">نظرة عامة</h2>
            <StatisticsCards />
          </section>

          {/* Section 3: Revenue & Charts */}
          <section>
             <h2 className="text-2xl font-bold text-gray-800 mb-6 font-heading border-r-4 border-gold pr-4">تحليل الإيرادات</h2>
             <RevenueAnalytics />
          </section>

          {/* Section 4: Subscriptions Table */}
          <section>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-800 font-heading border-r-4 border-gold pr-4">إدارة الاشتراكات والمدارس</h2>
               <button className="text-dark-purple hover:text-gold transition-colors text-sm font-bold flex items-center gap-1">
                 <Settings size={16} />
                 <span>إعدادات العرض</span>
               </button>
            </div>
            <SubscriptionsTable />
          </section>
        </main>
      </div>

      {/* Modals */}
      <AddSchoolModal 
        isOpen={isAddSchoolOpen} 
        onClose={() => setIsAddSchoolOpen(false)} 
        onSuccess={() => window.location.reload()} // Simple reload to refresh stats
      />
      <AssignPlanModal 
        isOpen={isAssignPlanOpen} 
        onClose={() => setIsAssignPlanOpen(false)} 
        onSuccess={() => window.location.reload()}
      />
    </>
  );
};

export default SuperAdminDashboard;
