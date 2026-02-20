
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSchoolData = (schoolId) => {
  const [data, setData] = useState({
    studentsCount: 0,
    invoicesCount: 0,
    paymentsSum: 0,
    overdueCount: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];

        // 1. Students Count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId);

        if (studentsError) throw studentsError;

        // 2. Invoices Count & Overdue
        // Total Invoices
        const { count: invoicesCount, error: invoicesError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId);
        
        if (invoicesError) throw invoicesError;

        // Overdue Invoices
        const { count: overdueCount, error: overdueError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId)
          .eq('status', 'pending')
          .lt('due_date', today);

        if (overdueError) throw overdueError;

        // 3. Payments Sum
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('amount')
          .eq('school_id', schoolId);

        if (paymentsError) throw paymentsError;

        const paymentsSum = paymentsData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

        if (mounted) {
          setData({
            studentsCount: studentsCount || 0,
            invoicesCount: invoicesCount || 0,
            paymentsSum: paymentsSum,
            overdueCount: overdueCount || 0
          });
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching school data:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [schoolId]);

  return { data, loading, error };
};
