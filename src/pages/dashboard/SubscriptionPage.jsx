
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Crown, CheckCircle, AlertTriangle } from 'lucide-react';

// Safe string handling function
const safe = (v) => typeof v === 'string' ? v.trim().toLowerCase() : '';

const SubscriptionPage = () => {
  const { school } = useOutletContext();

  if (!school) return null;

  const trialEnd = school.trial_end ? new Date(school.trial_end) : new Date();
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
  const status = safe(school.subscription_status);
  const isTrial = status === 'trial';
  const isActive = status === 'active';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="bg-gradient-to-r from-dark-purple to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                   <Crown size={32} className="text-gold" />
                </div>
                <div>
                   <h2 className="text-3xl font-bold font-heading">خطة الاشتراك</h2>
                   <p className="text-indigo-200">إدارة اشتراك مدرستك والترقية</p>
                </div>
             </div>
             
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-indigo-200 text-sm">الحالة الحالية</span>
                   {isTrial && <span className="bg-gold text-dark-purple px-3 py-1 rounded-full text-xs font-bold">فترة تجريبية</span>}
                   {isActive && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">نشط</span>}
                </div>
                
                {isTrial && (
                   <div className="mt-4">
                      <p className="text-2xl font-bold mb-1">{daysLeft > 0 ? daysLeft : 0} أيام متبقية</p>
                      <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mt-2">
                         <div 
                           className="bg-gold h-full" 
                           style={{ width: `${Math.max(0, Math.min(100, (daysLeft/7)*100))}%` }}
                         ></div>
                      </div>
                      <p className="text-xs text-indigo-300 mt-2">ينتهي في {trialEnd.toLocaleDateString('ar-EG')}</p>
                   </div>
                )}
             </div>

             {daysLeft <= 0 && isTrial && (
                <div className="mt-6 bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
                   <AlertTriangle className="text-red-200" />
                   <p className="font-bold text-red-100">انتهت الفترة التجريبية. يرجى ترقية الباقة لاستئناف الخدمات.</p>
                </div>
             )}
          </div>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-lg mb-4">مميزات باقتك الحالية</h3>
             <ul className="space-y-3">
                {['عدد طلاب غير محدود', 'فواتير غير محدودة', 'دعم فني', 'تقارير أساسية'].map((f, i) => (
                   <li key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={16} className="text-green-500" />
                      {String(f || '')}
                   </li>
                ))}
             </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center text-center">
             <h3 className="font-bold text-lg mb-2">هل تحتاج للمزيد؟</h3>
             <p className="text-gray-500 text-sm mb-6">قم بترقية باقتك للحصول على مميزات إضافية وتقارير متقدمة.</p>
             <button className="bg-gold text-dark-purple py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                ترقية الباقة الآن
             </button>
          </div>
       </div>
    </div>
  );
};

export default SubscriptionPage;
