
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { School, CheckCircle2, AlertCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StatisticsCards = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubs: 0,
    trialSchools: 0,
    expiredSubs: 0,
    monthlyRevenue: 0,
    annualRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1).toISOString();
        const todayStr = today.toISOString().split('T')[0];

        // 1. Schools Count
        const { count: totalSchools, error: schoolsError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });
        
        if (schoolsError) throw schoolsError;
        
        // 2. Active Subs
        const { count: activeSubs, error: activeError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'active');

        if (activeError) throw activeError;
        
        // 3. Trial Schools
        const { count: trialSchools, error: trialError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'trial')
          .gte('trial_end', todayStr);

        if (trialError) throw trialError;
        
        // 4. Expired Subs
        const { count: expiredSubs, error: expiredError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true })
          .neq('subscription_status', 'active')
          .lt('trial_end', todayStr); 
        
        if (expiredError) throw expiredError;

        // 5. Monthly Revenue
        const { data: monthlySubs, error: monthlyError } = await supabase
            .from('subscriptions')
            .select('price')
            .gte('start_date', firstDayOfMonth);
            
        if (monthlyError) throw monthlyError;

        // 6. Annual Revenue
        const { data: annualSubs, error: annualError } = await supabase
            .from('subscriptions')
            .select('price')
            .gte('start_date', firstDayOfYear);

        if (annualError) throw annualError;

        const monthlyRevenue = monthlySubs?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0;
        const annualRevenue = annualSubs?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0;

        setStats({
          totalSchools: totalSchools || 0,
          activeSubs: activeSubs || 0,
          trialSchools: trialSchools || 0,
          expiredSubs: expiredSubs || 0,
          monthlyRevenue,
          annualRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الإحصائيات",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const cards = [
    { label: 'إجمالي المدارس', value: stats.totalSchools, icon: School, color: 'bg-blue-100 text-blue-600' },
    { label: 'اشتراكات نشطة', value: stats.activeSubs, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    { label: 'فترة تجريبية', value: stats.trialSchools, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'اشتراكات منتهية', value: stats.expiredSubs, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    { label: 'دخل الشهر (ر.س)', value: stats.monthlyRevenue.toLocaleString(), icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
    { label: 'دخل السنة (ر.س)', value: stats.annualRevenue.toLocaleString(), icon: TrendingUp, color: 'bg-indigo-100 text-indigo-600' },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 font-heading">{card.value}</h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
