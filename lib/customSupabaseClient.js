
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewvsxdfgqpvvogmcuww.supabase.co'
const supabaseKey = 'sb_publishable_g1dtFH1aRhaoNCsZdJbKUQ_591ntx0x'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
