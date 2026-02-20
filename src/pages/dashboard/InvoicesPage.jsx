
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

// Safe string handling function
const safe = (v) => typeof v === 'string' ? v.trim().toLowerCase() : '';

const InvoicesPage = () => {
  const { school } = useOutletContext();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (school) fetchInvoices();
  }, [school]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
         .from('invoice_dashboard')
         .select('*')
         .eq('school_id', school.id)
         .order('issued_at', { ascending: false });
      
      if (error) throw error;
      setInvoices(Array.isArray(data) ? data : []);
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
          <h2 className="text-2xl font-bold font-heading text-gray-800">الفواتير</h2>
          <button className="bg-dark-purple text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-900">
             <Plus size={18} />
             إنشاء فاتورة
          </button>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-dark-purple" /></div>
          ) : (
             <table className="w-full">
                <thead className="bg-gray-50 text-sm text-gray-600">
                   <tr>
                      <th className="px-6 py-4 text-right">تاريخ الإصدار</th>
                      <th className="px-6 py-4 text-right">رقم الفاتورة</th>
                      <th className="px-6 py-4 text-right">المبلغ الإجمالي</th>
                      <th className="px-6 py-4 text-right">المدفوع</th>
                      <th className="px-6 py-4 text-right">الحالة</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {invoices.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-500">لا توجد فواتير حتى الآن</td></tr>
                   ) : invoices.map((inv, idx) => (
                      <tr key={inv.invoice_id || idx} className="hover:bg-gray-50">
                         <td className="px-6 py-4 text-sm text-gray-600">
                            {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString('ar-EG') : '-'}
                         </td>
                         <td className="px-6 py-4 font-mono text-sm">#{String(inv.invoice_id || '').substr(0,8)}</td>
                         <td className="px-6 py-4 font-bold">{Number(inv.total_amount || 0)} ر.س</td>
                         <td className="px-6 py-4 text-green-600">{Number(inv.paid_amount || 0)} ر.س</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                               safe(inv.status) === 'paid' ? 'bg-green-100 text-green-700' :
                               safe(inv.status) === 'partially_paid' ? 'bg-amber-100 text-amber-700' :
                               'bg-red-100 text-red-700'
                            }`}>
                               {safe(inv.status) === 'paid' ? 'مدفوع' : 
                                safe(inv.status) === 'partially_paid' ? 'مدفوع جزئياً' : 'غير مدفوع'}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
       </div>
    </div>
  );
};

export default InvoicesPage;
