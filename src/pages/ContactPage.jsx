
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      // Store in localStorage
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

      toast({
        title: 'تم إرسال رسالتك بنجاح!',
        description: 'سنتواصل معك في أقرب وقت ممكن',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'العنوان',
      content: 'الجيزة – الشيخ زايد – السرايا مول'
    },
    {
      icon: Phone,
      title: 'التليفون',
      content: '01200011220'
    },
    {
      icon: Mail,
      title: 'الايميل',
      content: 'info@qalopay.com'
    }
  ];

  return (
    <>
      <Helmet>
        <title>اتصل بنا - QaloPay</title>
        <meta name="description" content="تواصل مع فريق QaloPay - نحن هنا لمساعدتك في إدارة مدفوعات مدرستك بكل سهولة" />
      </Helmet>

      {/* Header */}
      <div className="bg-white pt-28 pb-16 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-dark-purple mb-6">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-500 font-body">
              فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في البدء
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 bg-very-light-purple">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-dark-purple">
                   <MessageSquare size={20} />
                 </div>
                 <h2 className="text-2xl font-bold font-heading text-dark-purple">أرسل لنا رسالة</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium font-body mb-2 text-sm">الاسم بالكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-dark-purple/20 focus:border-dark-purple transition-all duration-300"
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium font-body mb-2 text-sm">رقم الهاتف</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-dark-purple/20 focus:border-dark-purple transition-all duration-300"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium font-body mb-2 text-sm">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-dark-purple/20 focus:border-dark-purple transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium font-body mb-2 text-sm">اسم المدرسة / المؤسسة</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-dark-purple/20 focus:border-dark-purple transition-all duration-300"
                    placeholder="أدخل اسم المؤسسة"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium font-body mb-2 text-sm">تفاصيل الاستفسار</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-dark-purple/20 focus:border-dark-purple transition-all duration-300 resize-none"
                    placeholder="كيف يمكننا مساعدتك؟"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-dark-purple text-white px-8 py-4 rounded-xl text-lg font-bold font-heading hover:bg-light-purple transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'جاري الإرسال...' : (
                    <>
                      <span>إرسال الرسالة</span>
                      <Send size={20} className="rtl:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
               {/* Contact Cards */}
               <div className="grid gap-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="bg-very-light-purple p-3 rounded-xl text-dark-purple">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-bold font-heading text-lg mb-1">{info.title}</h3>
                          <p className="text-gray-600 font-medium font-body">{info.content}</p>
                        </div>
                      </div>
                    );
                  })}
               </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-3xl h-64 w-full overflow-hidden relative shadow-inner">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.453396783138!2d30.9634!3d30.0244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAxJzI3LjgiTiAzMMKwNTcnNDguMiJF!5e0!3m2!1sen!2seg!4v1635780000000!5m2!1sen!2seg" 
                   width="100%" 
                   height="100%" 
                   style={{border:0}} 
                   allowFullScreen="" 
                   loading="lazy"
                   title="Location Map"
                   className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                 ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
