
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // Redirect directly to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - QaloPay</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-dark-purple via-light-purple to-dark-purple flex items-center justify-center px-4 py-20 font-body" dir="rtl">
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={16} />
            العودة للرئيسية
          </Link>
        </div>

        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <img 
                src="https://horizons-cdn.hostinger.com/0e723638-e6f5-4bf8-b7e6-edc738be96d7/32b200f279a522cfb714e0bc29741e8c.png" 
                alt="QaloPay Logo" 
                className="h-16 w-auto mx-auto mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">تسجيل الدخول</h1>
              <p className="text-gray-200 font-body">مرحبًا بك في QaloPay</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <AlertCircle className="text-red-200 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-100 text-sm font-bold">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white text-lg mb-2 font-heading">الايميل</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 font-body"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-lg mb-2 font-heading">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 font-body"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-dark-purple px-8 py-4 rounded-xl text-xl font-bold font-heading hover:bg-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'تسجيل الدخول'}
              </button>

              <div className="text-center pt-2">
                <p className="text-gray-300 text-sm">
                  مدرسة جديدة؟ {' '}
                  <Link to="/register-school" className="text-white font-bold hover:text-gold transition-colors underline">
                    سجّل مدرستك الآن
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
