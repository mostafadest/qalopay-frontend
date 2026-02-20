
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ChangePlanModal from './ChangePlanModal';

const SchoolsTable = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحميل بيانات المدارس"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleToggleStatus = async (school) => {
    try {
      const newStatus = !school.is_active;
      const { error } = await supabase
        .from('schools')
        .update({ is_active: newStatus })
        .eq('id', school.id);

      if (error) throw error;

      setSchools(prev => prev.map(s => s.id === school.id ? { ...s, is_active: newStatus } : s));
      toast({
        title: newStatus ? "تم تفعيل المدرسة" : "تم إلغاء تفعيل المدرسة",
        className: newStatus ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
      });
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ في التحديث" });
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-700">المدرسة</th>
              <th className="px-6 py-4 font-bold text-gray-700">الباقة الحالية</th>
              <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
              <th className="px-6 py-4 font-bold text-gray-700">تاريخ الانتهاء</th>
              <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{school.name}</td>
                <td className="px-6 py-4 text-gray-600">{school.plan || 'غير محدد'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    school.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                    school.subscription_status === 'trial' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {school.subscription_status === 'active' ? 'نشط' : 
                     school.subscription_status === 'trial' ? 'تجريبي' : 'منتهي'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {school.subscription_status === 'trial' ? school.trial_end : school.subscription_end}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(school)}
                    className={`p-2 rounded-lg transition-colors ${
                      school.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                    title={school.is_active ? "إلغاء التفعيل" : "تفعيل"}
                  >
                    {school.is_active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button
                    onClick={() => setSelectedSchool(school)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="تغيير الباقة"
                  >
                    <Settings size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSchool && (
        <ChangePlanModal
          isOpen={!!selectedSchool}
          onClose={() => setSelectedSchool(null)}
          subscription={{ school_id: selectedSchool.id, school: selectedSchool }} 
          onSuccess={() => {
            fetchSchools();
            setSelectedSchool(null);
          }}
        />
      )}
    </>
  );
};

export default SchoolsTable;
