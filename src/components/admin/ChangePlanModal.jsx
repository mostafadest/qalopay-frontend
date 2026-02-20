
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const ChangePlanModal = ({ isOpen, onClose, subscription, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchPlans = async () => {
        const { data } = await supabase.from('plans').select('*');
        setPlans(data || []);
        if (subscription?.plan_id) setSelectedPlanId(subscription.plan_id);
      };
      fetchPlans();
    }
  }, [isOpen, subscription]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPlan = plans.find(p => p.id === selectedPlanId);
      if (!newPlan) throw new Error("Plan not found");

      // Update subscription record
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_id: selectedPlanId,
          price: newPlan.price,
          billing_cycle: newPlan.billing_cycle
        })
        .eq('id', subscription.id);

      if (error) throw error;

      // Update school plan name cache if exists
      await supabase
        .from('schools')
        .update({ plan: newPlan.name })
        .eq('id', subscription.school_id);

      toast({ title: "تم تغيير الباقة بنجاح" });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-dark-purple">تغيير الباقة</h3>
          <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">جاري تغيير الباقة للمدرسة: <span className="font-bold text-gray-800">{subscription.school?.name}</span></p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الباقة الجديدة</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.price} ريال/{p.billing_cycle})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg font-bold">إلغاء</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gold text-dark-purple rounded-lg font-bold flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'تأكيد التغيير'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePlanModal;
