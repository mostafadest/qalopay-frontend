
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const RoleBasedRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
         navigate('/dashboard', { replace: true });
      } else {
         navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-dark-purple mb-4" />
      <p className="text-gray-500 font-body">جاري التوجيه...</p>
    </div>
  );
};

export default RoleBasedRedirect;
