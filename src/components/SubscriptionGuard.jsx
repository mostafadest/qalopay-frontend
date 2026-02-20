
import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Lock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const SubscriptionGuard = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-dark-purple mb-4" />
        <p className="text-gray-500 font-body">جاري التحقق من الاشتراك...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Super admins bypass subscription checks
  if (currentUser.is_super_admin || currentUser.role === 'super_admin') {
    return children;
  }

  const school = currentUser.school;
  
  if (!school) {
     // User has no school assigned? Suspicious state.
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border-t-4 border-red-500">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">حساب غير مكتمل</h2>
                <p className="text-gray-600 mb-6">لا يوجد مدرسة مرتبطة بهذا الحساب. يرجى التواصل مع الدعم الفني.</p>
            </div>
        </div>
     );
  }

  const isTrial = school.subscription_status === 'trial';
  const isActive = school.subscription_status === 'active';
  
  // Check dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const trialEnd = school.trial_end ? new Date(school.trial_end) : null;
  const subEnd = school.subscription_end ? new Date(school.subscription_end) : null;

  let hasAccess = false;
  let message = "";

  if (isActive) {
      if (subEnd && subEnd < today) {
          hasAccess = false;
          message = "انتهت فترة اشتراكك. يرجى تجديد الاشتراك للاستمرار.";
      } else {
          hasAccess = true;
      }
  } else if (isTrial) {
      if (trialEnd && trialEnd < today) {
          hasAccess = false;
          message = "انتهت الفترة التجريبية المجانية. يرجى الاشتراك في إحدى الباقات للاستمرار.";
      } else {
          hasAccess = true;
      }
  } else {
      // Suspended, expired, or unknown
      hasAccess = false;
      message = "حساب المدرسة غير نشط أو تم إيقافه. يرجى مراجعة الإدارة.";
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-body" dir="rtl">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg text-center border-t-8 border-red-500">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-heading">الوصول مقيد</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {message}
          </p>
          <a href="/pricing" className="inline-block bg-dark-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-light-purple transition-all shadow-lg hover:shadow-xl">
            عرض باقات الاشتراك
          </a>
          <p className="mt-6 text-sm text-gray-400">
            للمساعدة، تواصل معنا على support@qalopay.com
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default SubscriptionGuard;
