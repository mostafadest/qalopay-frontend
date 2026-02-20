
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-red-600 text-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold font-heading">خطأ</h3>
          <p className="text-lg font-body leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
