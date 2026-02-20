
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings, Save } from 'lucide-react';

const SettingsPage = () => {
  const { school } = useOutletContext();
  
  if (!school) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <Settings className="text-gray-400" />
             <h2 className="font-bold text-lg">إعدادات المدرسة</h2>
          </div>
          
          <div className="p-6 space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدرسة</label>
                   <input disabled value={String(school.name || '')} className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                   <input disabled value={String(school.email || '')} className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                   <input defaultValue={String(school.phone || '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-dark-purple/10 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                   <input defaultValue={String(school.address || '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-dark-purple/10 outline-none" />
                </div>
             </div>
             
             <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="bg-dark-purple text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-900 flex items-center gap-2">
                   <Save size={18} />
                   حفظ التغييرات
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SettingsPage;
