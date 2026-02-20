
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, FileText, Clock, DollarSign } from 'lucide-react';
import { Loader2 } from 'lucide-react';
String(v || '').trim()
const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const KPICard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {subtext && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{String(subtext || '')}</span>}
    </div>
    <h3 className="text-3xl font-bold text-gray-800 mb-1 font-heading">{String(value || '')}</h3>
    <p className="text-gray-500 text-sm font-medium">{String(title || '')}</p>
  </div>
);

const MainDashboard = () => {
  const { school } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalStudents: 0,
    totalInvoices: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    partiallyPaidAmount: 0,
    totalCollected: 0,
    remainingBalance: 0,
    invoiceStatusData: [],
    monthlyData: [],
    paymentMethodsData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (!school) return;

        // 1. Fetch Students Count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id);

        if (studentsError) throw studentsError;

        // 2. Fetch Invoice Dashboard Stats
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoice_dashboard')
          .select('*')
          .eq('school_id', school.id);

        if (invoicesError) throw invoicesError;

        // Ensure array
        const invoices = Array.isArray(invoicesData) ? invoicesData : [];

        // Calculate totals
        const totalInv = invoices.length;
        const totalPaid = invoices.reduce((sum, inv) => sum + (Number(inv?.paid_amount) || 0), 0);
        const totalTotal = invoices.reduce((sum, inv) => sum + (Number(inv?.total_amount) || 0), 0);
        
        // Status Distribution using safe()
        const paidCount = invoices.filter(i => safe(i?.status) === 'paid').length;
        const unpaidCount = invoices.filter(i => safe(i?.status) === 'unpaid').length;
        const partialCount = invoices.filter(i => safe(i?.status) === 'partially_paid').length;

        // 3. Fetch Payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('school_id', school.id);

        if (paymentsError) throw paymentsError;

        const payments = Array.isArray(paymentsData) ? paymentsData : [];

        // Group payments
        const methodCounts = payments.reduce((acc, curr) => {
           const method = String(curr?.payment_method || 'Unknown');
           acc[method] = (acc[method] || 0) + 1;
           return acc;
        }, {});
        
        const paymentMethodsChart = Object.keys(methodCounts).map(key => ({
           name: key,
           value: methodCounts[key]
        }));

        // Mock Monthly Data
        const monthlyData = [
          { name: 'يناير', amount: 0 }, { name: 'فبراير', amount: 0 }, { name: 'مارس', amount: 0 },
          { name: 'أبريل', amount: 0 }, { name: 'مايو', amount: 0 }, { name: 'يونيو', amount: 0 }
        ];

        setData({
          totalStudents: Number(studentsCount || 0),
          totalInvoices: totalInv,
          paidAmount: totalPaid,
          unpaidAmount: 0,
          totalCollected: totalPaid,
          remainingBalance: totalTotal - totalPaid,
          invoiceStatusData: [
             { name: 'مدفوع', value: paidCount },
             { name: 'غير مدفوع', value: unpaidCount },
             { name: 'مدفوع جزئياً', value: partialCount }
          ],
          monthlyData,
          paymentMethodsData: paymentMethodsChart.length > 0 ? paymentMethodsChart : [{ name: 'لا يوجد بيانات', value: 1 }]
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [school]);

  if (!school) return null;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-dark-purple h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
             title="إجمالي الطلاب" 
             value={data.totalStudents} 
             icon={Users} 
             color="bg-blue-500" 
          />
          <KPICard 
             title="إجمالي الفواتير" 
             value={data.totalInvoices} 
             icon={FileText} 
             color="bg-indigo-500" 
          />
          <KPICard 
             title="المبلغ المحصل" 
             value={`${Number(data.totalCollected).toLocaleString()} ر.س`} 
             icon={DollarSign} 
             color="bg-emerald-500" 
          />
          <KPICard 
             title="الرصيد المتبقي" 
             value={`${Number(data.remainingBalance).toLocaleString()} ر.س`} 
             icon={Clock} 
             color="bg-amber-500" 
          />
       </div>

       {/* Charts Row 1 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-6 font-heading">حالة الفواتير</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                         data={data.invoiceStatusData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         fill="#8884d8"
                         paddingAngle={5}
                         dataKey="value"
                      >
                         {data.invoiceStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-6 font-heading">توزيع طرق الدفع</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                         data={data.paymentMethodsData}
                         cx="50%"
                         cy="50%"
                         outerRadius={80}
                         fill="#8884d8"
                         dataKey="value"
                         label={({name, percent}) => `${String(name || '')} ${(percent * 100).toFixed(0)}%`}
                      >
                         {data.paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Monthly Chart */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 font-heading">التحصيل الشهري (تجريبي)</h3>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="amount" fill="#5B3FA6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
};

export default MainDashboard;
