
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SubscriptionsTable = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscriptions without the plan join to avoid FK issues
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select(`
            *,
            school:schools(name)
        `)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Fetch plans separately
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('id, name');
        
      if (plansError) throw plansError;

      setSubscriptions(subsData || []);
      setPlans(plansData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: "destructive", title: "فشل تحميل البيانات" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (sub) => {
    setEditingId(sub.id);
    setEditPrice(sub.price);
  };

  const handleSavePrice = async (id) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ price: editPrice })
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, price: editPrice } : sub));
      setEditingId(null);
      toast({ title: "تم تحديث السعر بنجاح" });
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ في التحديث" });
    }
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : 'غير معروف';
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  const trialSchools = subscriptions.filter(s => s.subscription_status === 'trial' || (s.school && s.school.subscription_status === 'trial'));

  return (
    <div className="space-y-8">
      {/* Active Subscriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
           <h3 className="font-bold text-gray-700">جميع الاشتراكات</h3>
        </div>
        <table className="w-full text-right">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-700">المدرسة</th>
              <th className="px-6 py-4 font-bold text-gray-700">الباقة</th>
              <th className="px-6 py-4 font-bold text-gray-700">الدورة</th>
              <th className="px-6 py-4 font-bold text-gray-700">السعر</th>
              <th className="px-6 py-4 font-bold text-gray-700">تحرير</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{sub.school?.name || 'غير معروف'}</td>
                <td className="px-6 py-4 text-gray-600">{getPlanName(sub.plan_id)}</td>
                <td className="px-6 py-4 text-gray-600">{sub.billing_cycle === 'yearly' ? 'سنوي' : 'شهري'}</td>
                <td className="px-6 py-4">
                  {editingId === sub.id ? (
                    <input 
                       type="number" 
                       value={editPrice} 
                       onChange={(e) => setEditPrice(e.target.value)}
                       className="w-24 px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="font-bold text-dark-purple">{sub.price} ر.س</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === sub.id ? (
                    <div className="flex gap-2">
                       <button onClick={() => handleSavePrice(sub.id)} className="text-green-600"><Check size={18} /></button>
                       <button onClick={() => setEditingId(null)} className="text-red-600"><X size={18} /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(sub)} className="text-gray-400 hover:text-blue-600">
                      <Edit2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trial Schools Section */}
      {trialSchools.length > 0 && (
         <div className="bg-amber-50 rounded-xl border border-amber-100 overflow-hidden p-6">
            <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               مدارس في الفترة التجريبية (7 أيام)
            </h3>
            <div className="grid gap-2">
               {trialSchools.map(s => (
                  <div key={s.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                     <span className="font-medium text-gray-700">{s.school?.name}</span>
                     <span className="text-sm text-gray-500">ينتهي في: {s.trial_end}</span>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default SubscriptionsTable;
