
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="py-20 bg-dark-purple text-center">
      <div className="container mx-auto px-4">
        <motion.h1
          className='text-3xl font-bold text-white leading-tight mb-8 font-heading'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          دعنا نحول أفكارك إلى واقع
        </motion.h1>
        
        <Link 
          to="/register-school" 
          className="inline-block bg-gold text-dark-purple px-10 py-4 rounded-xl text-lg font-bold font-heading hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
        >
          ابدأ الآن
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
