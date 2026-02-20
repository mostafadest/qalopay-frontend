
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, BarChart3, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>QaloPay - إدارة وتحصيل أقساط مدرستك بدون تعقيد</title>
        <meta name="description" content="تابع الطلاب، أنشئ الفواتير وسوّي المدفوعات من جميع طرق الدفع في مكان واحد" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#5B3FA6_0%,#6E4BC3_100%)]">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1644995722044-6cd197ffb440?q=80&w=2070&auto=format&fit=crop" 
            alt="Fintech Dashboard Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5B3FA6]/60 to-[#6E4BC3]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6E4BC3] to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-12 pb-16 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-5xl mx-auto flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-5 mb-5 md:mt-[30px] md:mb-[30px] flex justify-center w-full"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/2af58d817a350bf161437ea55b1694ac.png" 
                alt="QaloPay Corporate Logo" 
                className="h-[130px] md:h-[220px] w-auto max-w-[85%] object-contain block mx-auto"
                style={{ 
                  imageRendering: 'crisp-edges',
                  filter: 'none',
                  opacity: 1
                }}
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-7xl font-bold font-heading text-white mb-8 leading-tight tracking-tight drop-shadow-lg"
            >
              إدارة وتحصيل أقساط مدرستك... <br />
              <span className="text-gold relative inline-block">
                بدون تعقيد
                <span className="absolute inset-0 bg-gold/10 blur-2xl -z-10 rounded-full"></span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-2xl text-gray-100 font-body mb-10 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm"
            >
              منصة سحابية متكاملة تمنحك السيطرة الكاملة على الشؤون المالية لمدرستك. 
              فواتير آلية، تحصيل متعدد القنوات، وتقارير لحظية.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link
                to="/register-school"
                className="w-full sm:w-auto bg-gold text-dark-purple px-10 py-4 rounded-xl text-lg font-bold font-heading hover:bg-[#ffe066] transition-all duration-300 hover:shadow-[0_0_25px_rgba(242,201,76,0.5)] hover:-translate-y-1 min-w-[220px]"
              >
                سجّل مدرستك الآن
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-xl text-lg font-bold font-heading hover:bg-white/25 transition-all duration-300 min-w-[220px]"
              >
                اكتشف المميزات
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Features Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-dark-purple mb-4">لماذا تختار QaloPay؟</h2>
            <p className="text-gray-500 text-lg font-body">حلول متكاملة مصممة خصيصًا لتلبية احتياجات المدارس العصرية، تجمع بين سهولة الاستخدام وقوة الأداء.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { 
                icon: Users,
                title: 'إدارة الطلاب', 
                description: 'سجّل وتابع بيانات الطلاب بسهولة مع ملفات شاملة لكل طالب وتاريخ مدفوعات مفصل.' 
              },
              { 
                icon: CheckCircle2,
                title: 'الفواتير الذكية', 
                description: 'أنشئ فواتير تلقائية ودورية، مع نظام تذكير ذكي للأقساط المستحقة والمتأخرة.' 
              },
              { 
                icon: BarChart3,
                title: 'تقارير فورية', 
                description: 'لوحة تحكم قيادية تمنحك تحليلات مالية دقيقة ورؤية واضحة للتدفقات النقدية.' 
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-light-purple/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-very-light-purple rounded-xl flex items-center justify-center mb-6 text-dark-purple">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-dark-purple text-xl font-bold font-heading mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base font-body">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-very-light-purple">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-dark-purple mb-6 leading-tight">شريكك الموثوق في <br/>النجاح المالي</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-body">
                نحن ندرك حجم المسؤولية الملقاة على عاتق المؤسسات التعليمية. لذلك، قمنا ببناء QaloPay ليكون أكثر من مجرد نظام لإدارة المدفوعات؛ إنه شريك استراتيجي يساعدك على النمو والاستقرار المالي، مع ضمان أعلى معايير الأمان والخصوصية.
              </p>
              <Link 
                to="/register-school"
                className="text-dark-purple font-bold font-heading text-lg hover:text-light-purple transition-colors inline-flex items-center gap-2 group border-b-2 border-gold pb-1"
              >
                ابدأ رحلتك الآن
                <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform rtl:rotate-180" />
              </Link>
            </div>
            <div className="md:w-1/2 relative">
               <div className="absolute -inset-4 bg-gold/20 rounded-full blur-3xl opacity-30"></div>
               <img 
                 src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/background-En40v.png" 
                 alt="Team working" 
                 className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[400px]"
               />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
