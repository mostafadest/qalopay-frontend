
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Shield, Users, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Building2,
      title: 'شركة تقنية مصرية',
      description: 'نحن فخورون بكوننا شركة مصرية 100%، نفهم تحديات السوق المحلي واحتياجات المؤسسات التعليمية في منطقتنا.'
    },
    {
      icon: Shield,
      title: 'الأمان والموثوقية',
      description: 'نضع أمان بياناتك على رأس أولوياتنا. نستخدم أحدث تقنيات التشفير لضمان سرية وسلامة جميع المعاملات المالية.'
    },
    {
      icon: Users,
      title: 'التركيز على التعليم',
      description: 'نحن نؤمن بأن المدارس يجب أن تركز على رسالتها السامية. دعنا نهتم نحن بالأرقام والتحصيل المالي.'
    },
    {
      icon: TrendingUp,
      title: 'الكفاءة والشفافية',
      description: 'نهدف إلى القضاء على البيروقراطية المالية وتعزيز الشفافية بين المدرسة وأولياء الأمور من خلال حلول ذكية.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>من نحن - QaloPay</title>
        <meta name="description" content="QaloPay شركة تقنية مصرية متخصصة في تقديم حلول التكنولوجيا للمؤسسات التعليمية" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-white pt-28 pb-20 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
           >
             <h1 className="text-4xl md:text-6xl font-bold font-heading text-dark-purple mb-8">من نحن</h1>
             <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light font-body">
              نحن نمكّن المؤسسات التعليمية من بناء مستقبل أفضل من خلال تكنولوجيا مالية متطورة.
             </p>
           </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-24 bg-very-light-purple">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold font-heading text-dark-purple mb-6">قصتنا</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 font-body">
                في <span className="text-dark-purple font-bold">QaloPay</span>، نحن شركة تقنية مصرية متخصصة في تقديم حلول التكنولوجيا للمؤسسات التعليمية. انطلقنا من رؤية واضحة: تبسيط إدارة المدفوعات والتحصيل وجعلها أكثر كفاءة وأمانًا وشفافية.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-body">
                نؤمن بأن المدارس يجب أن تركز على رسالتها الأساسية — التعليم وبناء الأجيال — بينما نتولى نحن إدارة العمليات المالية بأحدث التقنيات وأعلى معايير الأمان والموثوقية. فريقنا يجمع بين خبرات عميقة في التكنولوجيا المالية وفهم دقيق لقطاع التعليم.
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-dark-purple mb-4">قيمنا الأساسية</h2>
            <p className="text-gray-500 font-body">المبادئ التي تقود كل ما نقوم به</p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-start gap-6"
                >
                  <div className="bg-dark-purple/5 p-4 rounded-xl flex-shrink-0">
                    <Icon className="text-dark-purple" size={28} />
                  </div>
                  <div>
                    <h3 className="text-dark-purple text-xl font-bold font-heading mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-body">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-20 bg-dark-purple text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '+50', label: 'مدرسة شريكة' },
              { number: '+10k', label: 'طالب مسجل' },
              { number: '100%', label: 'نسبة الأمان' },
              { number: '24/7', label: 'دعم فني' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold font-heading text-gold mb-2">{stat.number}</div>
                <div className="text-gray-300 font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
