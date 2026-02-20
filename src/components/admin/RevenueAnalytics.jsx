
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const RevenueAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);

        // Fetch subscriptions that started within the last year
        const { data: subs, error } = await supabase
          .from('subscriptions')
          .select('price, start_date')
          .gte('start_date', oneYearAgo.toISOString())
          .order('start_date', { ascending: true });

        if (error) throw error;

        // Process data: Group by month
        const grouped = {};
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        
        // Initialize last 12 months
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(2,2)}`;
            grouped[key] = { name: key, total: 0, order: d.getTime() };
        }

        if (subs) {
          subs.forEach(s => {
            if (s.start_date) {
              const d = new Date(s.start_date);
              const key = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(2,2)}`;
              if (grouped[key]) {
                grouped[key].total += Number(s.price);
              }
            }
          });
        }

        const chartData = Object.values(grouped).sort((a, b) => a.order - b.order);
        setData(chartData);
      } catch (err) {
        console.error("Revenue fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <div className="h-80 flex items-center justify-center bg-white rounded-xl"><Loader2 className="animate-spin text-dark-purple" /></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-xl font-bold font-heading text-dark-purple mb-6">تحليل الإيرادات الشهرية</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
          <Tooltip 
            cursor={{fill: '#f9fafb'}}
            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
          />
          <Bar dataKey="total" fill="#5B3FA6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAnalytics;
