
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simplified session handler
  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    // Note: We don't set loading false here immediately, we wait for school fetch
  }, []);

  // School fetching logic moved here to be globally available
  const fetchSchool = useCallback(async (userId) => {
    if (!userId) {
      setSchool(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching school for owner_id:', userId);
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('owner_id', userId) // Corrected from owner_user_id to owner_id
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('School Query Error:', error);
        // Don't throw, just log. We handle "no school" in UI.
      }

      console.log('School Result:', data);
      setSchool(data);
    } catch (err) {
      console.error('Unexpected error fetching school:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial session check
    const getSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await handleSession(currentSession);
        
        // Fetch school if user exists
        if (currentSession?.user) {
          await fetchSchool(currentSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        await handleSession(currentSession);
        if (currentSession?.user) {
          await fetchSchool(currentSession.user.id);
        } else {
          setSchool(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, fetchSchool]);

  const signUp = useCallback(async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account",
      });
      return { data: null, error };
    }
  }, [toast]);

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;
        if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'البريد الإلكتروني لم يتم تأكيده. يرجى التحقق من بريدك الإلكتروني.';
        } else if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'بيانات الدخول غير صحيحة.';
        }
        throw new Error(errorMessage);
      }
      return { data, error: null };
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setSchool(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    school, // Exported school
    loading,
    isAuthenticated: !!user,
    currentUser: user,
    signUp,
    login,
    signIn: login,
    signInWithPassword: login,
    signOut,
    refreshSchool: () => user && fetchSchool(user.id) // Helper to re-fetch school
  }), [user, session, school, loading, signUp, login, signOut, fetchSchool]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
