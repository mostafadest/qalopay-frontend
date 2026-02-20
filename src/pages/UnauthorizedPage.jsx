
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const UnauthorizedPage = () => {
  const { currentUser } = useAuth();

  let backLink = '/';
  if (currentUser?.role === 'super_admin') backLink = '/admin';
  else if (currentUser?.role === 'school_admin' || currentUser?.role === 'admin') backLink = '/dashboard';

  return (
    <>
      <Helmet>
        <title>غير مصرح بالوصول - QaloPay</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-body" dir="rtl">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500 w-10 h-10" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-heading">
            تم رفض الوصول
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            عذراً، ليس لديك الصلاحية اللازمة للوصول إلى هذه الصفحة. يرجى التأكد من حسابك أو التواصل مع الدعم الفني إذا كنت تعتقد أن هذا خطأ.
          </p>
          
          <div className="space-y-3">
             <Link 
              to={backLink}
              className="block w-full bg-dark-purple text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-900 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} />
              العودة للرئيسية
            </Link>
            
            <Link 
              to="/login"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              تسجيل دخول بحساب آخر
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
