
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, FileText, CreditCard, Wallet, BarChart3, Shield, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const features = [
    {
      icon: Users,
      title: 'إدارة الطلاب بسهولة',
      description: 'سجّل بيانات الطلاب، تابع حالتهم الدراسية، وصنّفهم حسب الصفوف بكل سهولة. واجهة موحدة لجميع ملفات الطلاب.'
    },
    {
      icon: FileText,
      title: 'إنشاء الفواتير والأقساط',
      description: 'أنشئ فواتير تلقائية لكل طالب، وحدّد مواعيد الاستحقاق والأقساط بمرونة تامة. نظام ذكي للفواتير المتكررة.'
    },
    {
      icon: CreditCard,
      title: 'متابعة المدفوعات',
      description: 'تتبّع المدفوعات المستحقة والمتأخرة، واحصل على تنبيهات فورية. رؤية واضحة للتدفق النقدي.'
    },
    {
      icon: Wallet,
      title: 'تسوية المدفوعات',
      description: 'سجّل المدفوعات من جميع الطرق: كاش، بنكي، محافظ إلكترونية، أو Paymob. تسوية آلية بدون أخطاء.'
    },
    {
      icon: BarChart3,
      title: 'تقارير مالية واضحة',
      description: 'احصل على تقارير شاملة عن الإيرادات، المستحقات، والمدفوعات بضغطة زر. قرارات مبنية على بيانات دقيقة.'
    },
    {
      icon: Shield,
      title: 'أمان البيانات المتقدم',
      description: 'حماية كاملة لبيانات مدرستك مع تشفير متقدم ونسخ احتياطي تلقائي. نحن نلتزم بأعلى معايير الأمان.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>المميزات - QaloPay</title>
        <meta name="description" content="كل مدفوعات مدرستك في لوحة تحكم واحدة - QaloPay يوفر لك نظام متكامل لإدارة الطلاب والفواتير والمدفوعات" />
      </Helmet>

      {/* Header */}
      <div className="bg-white py-20 pt-28 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-heading text-dark-purple mb-6"
          >
            كل مدفوعات مدرستك… <br/>
            <span className="text-gold">في لوحة تحكم واحدة</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 leading-relaxed font-body"
          >
            QaloPay يوفر لك نظام متكامل لإدارة الطلاب، الفواتير، والمدفوعات بكل سهولة ومرونة. 
            تابع كل شيء من مكان واحد، واحصل على تقارير مالية دقيقة وفورية.
          </motion.p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="py-24 bg-very-light-purple">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="w-14 h-14 bg-dark-purple/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-300">
                    <Icon className="text-dark-purple" size={28} />
                  </div>
                  <h3 className="text-dark-purple text-xl font-bold font-heading mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-body">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
               <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-6">
                 <Zap className="text-dark-purple" size={24} />
               </div>
               <h2 className="text-3xl md:text-4xl font-bold font-heading text-dark-purple mb-6">تكامل سلس مع أنظمتك</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed font-body">
                 لا داعي لتغيير طريقة عملك بالكامل. صُمم QaloPay ليتكامل بسهولة مع سير عملك الحالي، مما يضمن انتقالاً سلسًا وتجربة مستخدم ممتازة لفريقك ولأولياء الأمور.
               </p>
               <ul className="space-y-4 mb-8">
                 {['تصدير واستيراد البيانات بسهولة', 'واجهة برمجة تطبيقات (API) قوية', 'دعم فني مخصص لعملية الانتقال'].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-dark-purple font-medium font-body">
                     <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                       <ArrowRight size={14} className="text-green-600 rtl:rotate-180" />
                     </div>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                 <div className="space-y-4">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                       <div className="flex-1">
                         <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                         <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-dark-purple text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">جاهز لنقل مدرستك للمستوى التالي؟</h2>
          <Link
            to="/register-school"
            className="inline-block bg-gold text-dark-purple px-10 py-4 rounded-xl text-lg font-bold font-heading hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
          >
            تواصل معنا الآن
          </Link>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;
