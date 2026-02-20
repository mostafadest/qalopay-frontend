
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AcademicTermsPage = () => {
  const { school } = useOutletContext();
  const { toast } = useToast();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '' });

  useEffect(() => {
    if (school) fetchTerms();
  }, [school]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_terms')
        .select('*')
        .eq('school_id', school.id)
        .order('start_date', { ascending: false });
      if (error) throw error;
      setTerms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const safeName = String(formData.name || '');
      if (!safeName) {
        toast({ variant: "destructive", title: "خطأ", description: "يرجى إدخال اسم العام الدراسي" });
        return;
      }

      const { error } = await supabase.from('academic_terms').insert([{ 
        ...formData, 
        name: safeName,
        school_id: school.id 
      }]);
      
      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم إضافة العام الدراسي" });
      setFormData({ name: '', start_date: '', end_date: '' });
      fetchTerms();
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: error.message });
    }
  };

  if (!school) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-heading text-gray-800">الأعوام الدراسية</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 text-lg">إضافة عام دراسي</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم العام/الترم</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                  placeholder="مثال: الترم الأول 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">تاريخ البدء</label>
                <input 
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">تاريخ الانتهاء</label>
                <input 
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-dark-purple text-white py-2 rounded-lg font-bold hover:bg-indigo-900">
                إضافة
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>
             ) : (
                <table className="w-full">
                   <thead className="bg-gray-50 text-sm text-gray-600">
                      <tr>
                         <th className="px-6 py-4 text-right">الاسم</th>
                         <th className="px-6 py-4 text-right">البداية</th>
                         <th className="px-6 py-4 text-right">النهاية</th>
                         <th className="px-6 py-4 text-right"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y">
                      {terms.length === 0 ? (
                         <tr><td colSpan="4" className="p-6 text-center text-gray-500">لا توجد أعوام دراسية مضافة</td></tr>
                      ) : (
                         terms.map(term => (
                            <tr key={term.id} className="hover:bg-gray-50">
                               <td className="px-6 py-4 font-bold">{String(term.name || '')}</td>
                               <td className="px-6 py-4 text-sm text-gray-500">{term.start_date || '-'}</td>
                               <td className="px-6 py-4 text-sm text-gray-500">{term.end_date || '-'}</td>
                               <td className="px-6 py-4 flex gap-2 justify-end">
                                  <button className="text-gray-400 hover:text-blue-600"><Edit2 size={16}/></button>
                                  <button className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTermsPage;
