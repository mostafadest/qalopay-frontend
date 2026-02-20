
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Upload, Loader2, User, MoreVertical, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StudentsPage = () => {
  const { school } = useOutletContext();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Student Form State
  const [newStudent, setNewStudent] = useState({ full_name: '', class_id: '' });
  const [classes, setClasses] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (school) {
      fetchStudents();
      fetchClasses();
    }
  }, [school]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          classes (name)
        `)
        .eq('school_id', school.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحميل قائمة الطلاب" });
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('id, name').eq('school_id', school.id);
    setClasses(Array.isArray(data) ? data : []);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Use String() for safety during save
    const safeName = String(newStudent.full_name || '');
    
    try {
      if (!safeName) throw new Error("اسم الطالب مطلوب");

      const { error } = await supabase
        .from('students')
        .insert([{
          school_id: school.id,
          full_name: safeName,
          class_id: newStudent.class_id || null
        }]);
      
      if (error) throw error;
      
      toast({ title: "تم بنجاح", description: "تم إضافة الطالب بنجاح" });
      setNewStudent({ full_name: '', class_id: '' });
      setIsAddOpen(false);
      fetchStudents();
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Safe filtering logic
  const filteredStudents = (Array.isArray(students) ? students : []).filter(student => 
    safe(student?.full_name).includes(safe(searchTerm))
  );

  if (!school) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold font-heading text-gray-800">إدارة الطلاب</h2>
            <p className="text-gray-500">عرض وإدارة جميع طلاب المدرسة</p>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="bg-dark-purple text-white px-4 py-2 rounded-xl hover:bg-indigo-900 transition-colors flex items-center gap-2 font-bold"
            >
               {isAddOpen ? <X size={18} /> : <Plus size={18} />}
               <span>{isAddOpen ? 'إلغاء' : 'إضافة طالب'}</span>
            </button>

            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-bold">
               <Upload size={18} />
               <span className="hidden sm:inline">استيراد</span>
            </button>
         </div>
      </div>

      {isAddOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-top-4 duration-300">
           <h3 className="font-bold text-lg mb-4">إضافة طالب جديد</h3>
           <form onSubmit={handleAddStudent} className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">اسم الطالب</label>
                 <input 
                   required
                   value={newStudent.full_name}
                   onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dark-purple/20 outline-none transition-all"
                   placeholder="الاسم الثلاثي"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">الفصل (اختياري)</label>
                 <select 
                   value={newStudent.class_id}
                   onChange={(e) => setNewStudent({...newStudent, class_id: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dark-purple/20 outline-none bg-white transition-all"
                 >
                   <option value="">اختر الفصل...</option>
                   {classes.map(c => <option key={c.id} value={c.id}>{String(c.name || '')}</option>)}
                 </select>
               </div>
             </div>
             <div className="flex justify-end pt-2">
               <button 
                 type="submit" 
                 disabled={submitting}
                 className="bg-gold text-dark-purple px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2 min-w-[100px] justify-center"
               >
                 {submitting ? <Loader2 className="animate-spin" size={18} /> : 'حفظ البيانات'}
               </button>
             </div>
           </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-sm">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="بحث باسم الطالب..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-dark-purple/10"
               />
            </div>
         </div>
         
         {loading ? (
            <div className="p-12 text-center">
               <Loader2 className="animate-spin h-8 w-8 text-dark-purple mx-auto" />
               <p className="text-gray-500 mt-2">جاري التحميل...</p>
            </div>
         ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
               <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
               <h3 className="text-lg font-bold text-gray-700">لا يوجد طلاب</h3>
               <p className="text-gray-500">لم يتم العثور على طلاب مطابقين للبحث.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                     <tr>
                        <th className="px-6 py-4 text-right">اسم الطالب</th>
                        <th className="px-6 py-4 text-right">الفصل</th>
                        <th className="px-6 py-4 text-right">تاريخ الإضافة</th>
                        <th className="px-6 py-4 text-right">الإجراءات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                    {String(student.full_name || 'U').charAt(0)}
                                 </div>
                                 <span className="font-bold text-gray-800">{String(student.full_name || '')}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-600">
                              {student.classes?.name ? String(student.classes.name || '') : <span className="text-gray-400 italic">غير محدد</span>}
                           </td>
                           <td className="px-6 py-4 text-gray-500 text-sm">
                              {student.created_at ? new Date(student.created_at).toLocaleDateString('ar-EG') : '-'}
                           </td>
                           <td className="px-6 py-4">
                              <button className="text-gray-400 hover:text-dark-purple transition-colors">
                                 <MoreVertical size={18} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default StudentsPage;
