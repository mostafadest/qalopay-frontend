
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

const PaymentsPage = () => {
  const { school, isSubscriptionActive } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school) fetchPayments();
  }, [school]);

  const fetchPayments = async () => {
     try {
        setLoading(true);
        const { data, error } = await supabase
           .from('payments')
           .select('*, invoices(*)')
           .eq('school_id', school.id)
           .order('paid_at', { ascending: false });
        if (error) throw error;
        setPayments(Array.isArray(data) ? data : []);
     } catch (e) {
        console.error(e);
     } finally {
        setLoading(false);
     }
  };

  if (!school) return null;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-heading text-gray-800">المدفوعات</h2>
          <button 
             disabled={!isSubscriptionActive}
             className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <Plus size={18} />
             تسجيل دفعة
          </button>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>
          ) : (
             <table className="w-full">
                <thead className="bg-gray-50 text-sm text-gray-600">
                   <tr>
                      <th className="px-6 py-4 text-right">التاريخ</th>
                      <th className="px-6 py-4 text-right">المبلغ</th>
                      <th className="px-6 py-4 text-right">طريقة الدفع</th>
                      <th className="px-6 py-4 text-right">المرجع</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {payments.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500">لا توجد مدفوعات مسجلة</td></tr>
                   ) : payments.map(pay => (
                      <tr key={pay.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(pay.paid_at || pay.created_at).toLocaleDateString('ar-EG')}
                         </td>
                         <td className="px-6 py-4 font-bold text-emerald-600">{Number(pay.amount || 0)} ر.س</td>
                         <td className="px-6 py-4 text-sm font-medium">{String(pay.payment_method || '')}</td>
                         <td className="px-6 py-4 text-xs text-gray-400 font-mono">{String(pay.reference || '-')}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
       </div>
    </div>
  );
};

export default PaymentsPage;
