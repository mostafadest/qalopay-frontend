
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const ReportsPage = () => {
  const { school } = useOutletContext();
  const title = "التقارير المالية";
  const desc = "هذه الصفحة قيد التطوير. قريباً ستتمكن من استعراض تقارير مفصلة عن أداء مدرستك المالي.";

  if (!school) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="bg-indigo-50 p-6 rounded-full mb-6">
         <BarChart3 size={48} className="text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold font-heading text-gray-800 mb-2">{String(title || '')}</h2>
      <p className="text-gray-500 max-w-md">{String(desc || '')}</p>
    </div>
  );
};

export default ReportsPage;
