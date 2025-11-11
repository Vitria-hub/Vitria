import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const db = createClient<Database>(supabaseUrl, supabaseServiceKey);
