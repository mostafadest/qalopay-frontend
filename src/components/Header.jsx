
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'المميزات', path: '/features' },
    { name: 'الأسعار', path: '/pricing' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      } border-b border-gray-100 font-heading`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse group">
            <img 
              src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/q-logo-for-white-background-hH52e.png" 
              alt="QaloPay Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-semibold tracking-wide transition-all duration-300 hover:text-dark-purple relative ${
                  isActive(item.path) ? 'text-dark-purple' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                 <Link
                  to="/dashboard"
                  className="bg-dark-purple text-white px-6 py-2.5 rounded-[14px] font-bold hover:bg-indigo-900 transition-all duration-300 flex items-center gap-2"
                >
                  <User size={18} />
                  <span>لوحة التحكم</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-600 p-2.5 rounded-[14px] hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-200"
                  title="تسجيل خروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="bg-gray-100 text-dark-purple px-5 py-2.5 rounded-[14px] font-bold hover:bg-gray-200 transition-all duration-300"
                >
                  دخول
                </Link>
                <Link
                  to="/register-school"
                  className="bg-gold text-dark-purple px-6 py-2.5 rounded-[14px] font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 tracking-wide"
                >
                  تسجيل مدرسة
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-dark-purple p-2 hover:bg-gray-50 rounded-lg transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden bg-white border-t border-gray-100 font-body"
            >
              <div className="flex flex-col gap-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-semibold px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 text-lg text-right"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 pt-2 border-t border-gray-100 mt-2">
                   {isAuthenticated ? (
                      <div className="flex flex-col gap-2 pt-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full bg-dark-purple text-white px-4 py-3 rounded-[14px] font-bold text-center flex items-center justify-center gap-2"
                        >
                          <User size={18} />
                          لوحة التحكم
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full bg-red-50 text-red-600 px-4 py-3 rounded-[14px] font-bold text-center flex items-center justify-center gap-2 border border-red-100"
                        >
                          <LogOut size={18} />
                          تسجيل خروج
                        </button>
                      </div>
                   ) : (
                      <div className="flex flex-col gap-2 pt-2">
                         <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full bg-gray-100 text-dark-purple px-4 py-3 rounded-[14px] font-bold text-center"
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          to="/register-school"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full bg-gold text-dark-purple px-4 py-3 rounded-[14px] font-bold text-center"
                        >
                          تسجيل مدرسة
                        </Link>
                      </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
