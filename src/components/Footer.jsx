
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'المميزات', path: '/features' },
    { name: 'الأسعار', path: '/pricing' },
    { name: 'تواصل معنا', path: '/contact' }
  ];

  const legalLinks = [
    { name: 'سياسة الخصوصية', path: '/privacy' },
    { name: 'الشروط والأحكام', path: '/terms' },
    { name: 'اتفاقية مستوى الخدمة', path: '/sla' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com' }
  ];

  return (
    <footer className="bg-dark-purple text-white border-t border-white/5 font-body">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/a71af85e846ea16d0e8b7684a7a412c6.png" 
                alt="QaloPay Logo" 
                className="h-12 w-auto"
                style={{ 
                  filter: 'none',
                  imageRendering: 'crisp-edges'
                }}
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-body">
              منصة تكنولوجية رائدة للمؤسسات التعليمية في مصر. نساعدك على إدارة التحصيل المالي بكفاءة وأمان.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-dark-purple transition-all duration-300" 
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <span className="block text-white font-bold text-lg mb-6 font-heading">روابط هامة</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors duration-200 text-sm font-medium font-body">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="block text-white font-bold text-lg mb-6 font-heading">الدعم والقانوني</span>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors duration-200 text-sm font-medium font-body">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <span className="block text-white font-bold text-lg mb-6 font-heading">تواصل معنا</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm font-body">
                <MapPin size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span>الجيزة – الشيخ زايد – السرايا مول</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-body">
                <Phone size={18} className="text-gold flex-shrink-0" />
                <span dir="ltr">012 000 11 220</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-body">
                <Mail size={18} className="text-gold flex-shrink-0" />
                <span>info@qalopay.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-body">
            © 2026 QaloPay. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
             <span className="text-gray-600 text-xs font-body">رقم التسجيل الضريبي: 000-000-000</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
