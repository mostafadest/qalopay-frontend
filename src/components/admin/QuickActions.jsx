
import React from 'react';
import { PlusCircle, FileText, CreditCard, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuickActions = ({ onAddSchool, onAssignPlan }) => {
  const { toast } = useToast();

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 قريباً!",
      description: `سيتم تفعيل ميزة "${feature}" في التحديث القادم.`,
    });
  };

  const actions = [
    { label: 'إضافة مدرسة يدوياً', icon: PlusCircle, onClick: onAddSchool, color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { label: 'تعيين باقة لمدرسة', icon: CreditCard, onClick: onAssignPlan, color: 'bg-green-600', hover: 'hover:bg-green-700' },
    { label: 'إنشاء عقد مخصص', icon: FileText, onClick: () => handleNotImplemented('العقد المخصص'), color: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    { label: 'تصدير تقرير الدخل', icon: Download, onClick: () => handleNotImplemented('تصدير التقارير'), color: 'bg-orange-600', hover: 'hover:bg-orange-700' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} ${action.hover} text-white p-4 rounded-xl shadow-lg shadow-gray-200/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold`}
          >
            <Icon size={20} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
