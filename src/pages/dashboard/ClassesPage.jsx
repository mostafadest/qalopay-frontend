import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { safeTrim } from '@/utils/safeTrim';

const ClassesPage = () => {
  const { school } = useOutletContext();
  const { toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClass, setNewClass] = useState('');

  useEffect(() => { if (school) fetchClasses(); }, [school]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*, students(count)')
        .eq('school_id', school.id)
        .order('name');
      if (error) throw error;
      setClasses(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const safeName = safeTrim(newClass);
    if (!safeName) return;

    try {
      const { error } = await supabase.from('classes').insert([{ school_id: school.id, name: safeName }]);
      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم إضافة الفصل" });
      setNewClass('');
      fetchClasses();
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: e.message });
    }
  };

  if (!school) return null;

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold font-heading text-gray-800">الفصول الدراسية</h2>
       
       <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4">إضافة فصل جديد</h3>
                <form onSubmit={handleAdd} className="flex gap-2">
                   <input 
                     value={newClass}
                     onChange={e => setNewClass(e.target.value)}
                     className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                     placeholder="اسم الفصل (مثال: 1/A)"
                   />
                   <button type="submit" className="bg-gold text-dark-purple px-4 rounded-lg font-bold hover:bg-yellow-400">إضافة</button>
                </form>
             </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {loading ? <Loader2 className="animate-spin" /> : classes.map(cls => (
                <div key={cls.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                   <div>
                      <h4 className="font-bold text-lg text-dark-purple">{safeTrim(cls.name)}</h4>
                      <p className="text-xs text-gray-500">{cls.students?.[0]?.count || 0} طالب</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={18} />
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ClassesPage;