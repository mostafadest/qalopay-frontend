
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Star, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: 'الباقة الأساسية',
      slug: 'basic',
      price: '499',
      period: 'شهريًا',
      yearlyPrice: '4,790',
      yearlySavings: '1,198',
      setupFee: '999',
      features: [
        'حتى 200 طالب',
        'فواتير غير محدودة',
        'تقارير أساسية',
        'دعم عبر البريد الإلكتروني',
        'تطبيق لوحة التحكم'
      ],
      highlighted: false
    },
    {
      name: 'الباقة المميزة',
      slug: 'pro',
      price: '999',
      period: 'شهريًا',
      yearlyPrice: '9,590',
      yearlySavings: '2,398',
      setupFee: '0',
      originalSetupFee: '999',
      setupBadge: 'لفترة محدودة',
      features: [
        'طلاب غير محدودين',
        'فواتير غير محدودة',
        'تقارير متقدمة',
        'تحليلات مالية',
        'دعم أولوية',
        'صلاحيات متعددة المستخدمين'
      ],
      highlighted: true
    },
    {
      name: 'باقة الأعمال',
      slug: 'enterprise',
      price: null,
      customPrice: 'تواصل معنا',
      features: [
        'تكاملات مخصصة',
        'دعم مخصص',
        'مدير حساب',
        'استضافة مخصصة',
        'تقارير مخصصة',
        'ضمان الأداء SLA',
        'رسوم التكوين حسب حجم المؤسسة'
      ],
      highlighted: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>الأسعار - QaloPay</title>
        <meta name="description" content="خطط مرنة تناسب حجم مدرستك - تواصل معنا للبدء" />
      </Helmet>

      {/* Header */}
      <div className="bg-white pt-28 pb-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-gray-900 mb-6 tracking-tight">
              خطط مرنة <span className="text-gold relative inline-block">
                تناسب حجم مدرستك
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 font-light font-body max-w-2xl mx-auto">
              اختر الباقة المناسبة لمدرستك أو تواصل معنا للحصول على عرض مخصص
            </p>
            
            <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm font-heading">
              <ShieldCheck size={18} className="text-gold" />
              <span>ضمان استرجاع الأموال لمدة 30 يوم</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="pb-32 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlighted 
                    ? 'bg-white border-2 border-gold shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-10 md:-mt-4 md:mb-4' 
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gold text-dark-purple text-sm font-bold font-heading px-6 py-2 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <Star size={14} fill="currentColor" />
                    الأكثر طلباً
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center">
                  <h3 className={`text-2xl font-bold font-heading mb-4 ${plan.highlighted ? 'text-dark-purple' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  
                  {/* Pricing Display */}
                  <div className="h-32 flex flex-col justify-center items-center py-2">
                    {plan.price ? (
                      <>
                        <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
                           <span className="text-2xl font-bold font-heading text-gray-400 uppercase tracking-wider">EGP</span>
                           <span className="text-[3.5rem] leading-none font-extrabold font-heading text-gray-900 tracking-tight">
                            {plan.price}
                           </span>
                        </div>
                        <span className="text-gray-400 font-medium font-body mt-2 text-base">/ شهر</span>
                        
                        <div className="mt-4 px-3 py-1 bg-green-50 rounded-lg border border-green-100">
                           <p className="text-green-700 text-xs font-bold font-heading">
                              وفر {plan.yearlySavings} سنويًا
                           </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-3xl font-bold font-heading text-gray-900">{plan.customPrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

                {/* Setup Fee */}
                {plan.setupFee !== undefined && (
                  <div className="mb-8 text-center bg-gray-50 rounded-xl p-3 border border-gray-100/50">
                    {plan.setupBadge ? (
                      <div className="text-gold text-xs font-bold font-heading uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Zap size={12} fill="currentColor" />
                        {plan.setupBadge}
                      </div>
                    ) : null}
                    <p className="text-gray-600 text-sm font-medium font-body">
                      رسوم التكوين: {' '}
                      {plan.originalSetupFee && (
                        <span className="line-through text-gray-400 decoration-red-400 mx-1">{plan.originalSetupFee}</span>
                      )}
                      <span className={plan.setupFee === '0' ? 'text-green-600 font-bold' : 'text-gray-900 font-bold'}>
                        {plan.setupFee === '0' ? 'مجانًا' : `${plan.setupFee} EGP`}
                      </span>
                    </p>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3.5">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-gold text-dark-purple' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-gray-600 text-sm font-medium leading-tight pt-0.5 font-body">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to={plan.price ? `/register-school?plan=${plan.slug}` : "/contact"}
                  className={`block w-full text-center px-6 py-4 rounded-xl font-bold font-heading text-lg transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlighted
                      ? 'bg-gold text-dark-purple hover:bg-[#f5cf5b] shadow-lg hover:shadow-gold/25'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-gray-900/10'
                  }`}
                >
                  {plan.price ? 'ابدأ الآن' : 'تواصل معنا'}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <p className="text-gray-500 mb-2 font-body">هل لديك متطلبات خاصة لمؤسسة تعليمية كبيرة؟</p>
             <Link to="/contact" className="text-dark-purple font-bold font-heading hover:text-gold transition-colors border-b-2 border-dark-purple/10 hover:border-gold pb-0.5">
               تحدث مع فريق المبيعات لدينا
             </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
