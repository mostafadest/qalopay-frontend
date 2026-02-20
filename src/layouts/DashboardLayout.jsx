
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  LayoutDashboard, Users, GraduationCap, School, 
  FileText, CreditCard, PieChart, Settings, LogOut, 
  Menu, X, Bell, Crown, AlertTriangle
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Safe string handling function
String(v || '').trim()
const DashboardLayout = () => {
  const { currentUser, school, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isSubscriptionActive = () => {
    if (!school) return false;
    const now = new Date();
    const trialEnd = new Date(school.trial_end);
    const subEnd = school.subscription_end ? new Date(school.subscription_end) : null;
    
    // Active if trial not expired OR subscription active
    const status = safe(school.subscription_status);
    
    if (status === 'active' && subEnd && subEnd > now) return true;
    if (status === 'trial' && trialEnd > now) return true;
    
    return false;
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/dashboard', exact: true },
    { icon: Users, label: 'الطلاب', path: '/dashboard/students' },
    { icon: GraduationCap, label: 'الفصول الدراسية', path: '/dashboard/academic-terms' },
    { icon: School, label: 'الفصول', path: '/dashboard/classes' },
    { icon: FileText, label: 'الفواتير', path: '/dashboard/invoices' },
    { icon: CreditCard, label: 'المدفوعات', path: '/dashboard/payments' },
    { icon: PieChart, label: 'التقارير', path: '/dashboard/reports' },
    { icon: Crown, label: 'الاشتراك', path: '/dashboard/subscription' },
    { icon: Settings, label: 'الإعدادات', path: '/dashboard/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-dark-purple" />
      </div>
    );
  }

  // Graceful handling for no school
  if (!school) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4 font-body" dir="rtl">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">لا توجد مدرسة مرتبطة</h2>
        <p className="text-gray-600 mb-6">لم نتمكن من العثور على مدرسة مرتبطة بحسابك الحالي. يرجى التأكد من التسجيل كمالك مدرسة أو التواصل مع الدعم.</p>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-6 py-2 rounded-xl hover:bg-red-50 transition-colors font-bold shadow-sm"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-body flex" dir="rtl">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 right-0 h-screen w-64 bg-dark-purple text-white transition-transform duration-300 z-50 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-dark-purple font-bold text-lg">
               Q
             </div>
             <span className="font-heading font-bold text-xl tracking-wide">QaloPay</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
             <h3 className="font-bold text-sm truncate mb-1">{String(school.name || '')}</h3>
             <p className="text-xs text-indigo-200 flex items-center gap-1">
               <span className={`w-2 h-2 rounded-full ${isSubscriptionActive() ? 'bg-green-400' : 'bg-red-400'}`}></span>
               {isSubscriptionActive() ? 'اشتراك نشط' : 'اشتراك غير نشط'}
             </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gold text-dark-purple font-bold shadow-lg' 
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className={({ isActive }) => isActive ? 'text-dark-purple' : 'text-indigo-300 group-hover:text-white'} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-dark-purple">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
           >
             <LogOut size={18} />
             <span>تسجيل خروج</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
           <button 
             onClick={() => setSidebarOpen(true)}
             className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
           >
             <Menu size={24} />
           </button>

           <h1 className="text-xl font-bold text-gray-800 font-heading lg:mr-0 mr-4">
              {navItems.find(i => location.pathname === i.path || (location.pathname.startsWith(i.path) && i.path !== '/dashboard'))?.label || 'لوحة التحكم'}
           </h1>

           <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-dark-purple transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-white shadow-sm ring-2 ring-gray-50">
                {String(currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
           <Outlet context={{ school, isSubscriptionActive: isSubscriptionActive() }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
