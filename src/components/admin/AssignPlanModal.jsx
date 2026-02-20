
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AssignPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [plans, setPlans] = useState([]);
  
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const { data: schoolsData } = await supabase.from('schools').select('id, name');
        const { data: plansData } = await supabase.from('plans').select('*');
        
        setSchools(schoolsData || []);
        setPlans(plansData || []);
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchool || !selectedPlan) {
      toast({ title: "يرجى تعبئة جميع الحقول", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      const startDate = new Date();
      const endDate = new Date();
      
      if (plan.billing_cycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const { error } = await supabase.from('subscriptions').insert([{
        school_id: selectedSchool,
        plan_id: selectedPlan,
        price: plan.price,
        billing_cycle: plan.billing_cycle,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_paid: true,
        subscription_status: 'active'
      }]);

      if (error) throw error;

      // Update school status as well
      await supabase
        .from('schools')
        .update({ subscription_status: 'active', subscription_end: endDate })
        .eq('id', selectedSchool);

      toast({ title: "تم تفعيل الباقة بنجاح", className: "bg-green-50 text-green-900" });
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
          <h3 className="text-xl font-bold font-heading text-dark-purple">تعيين باقة لمدرسة</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none bg-white"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <option value="">اختر المدرسة...</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الباقة</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none bg-white"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">اختر الباقة...</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.price} ريال ({p.billing_cycle === 'yearly' ? 'سنوي' : 'شهري'})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg font-bold">إلغاء</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-dark-purple text-white rounded-lg font-bold flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'تفعيل الباقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPlanModal;
