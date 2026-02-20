import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqdzhjmzpnbzsvufltbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZHpoam16cG5ienN2dWZsdGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjU2MTMsImV4cCI6MjA4NzEwMTYxM30.mOFmzvqyrVSZcK4AsX_WlK3gZpyvDhdtHqcmUuZh_KI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
