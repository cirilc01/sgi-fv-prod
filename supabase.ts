import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://ktrrrqaqaljdcmxqdcff.supabase.co';
const fallbackSupabaseAnonKey = 'sb_publishable_ZcEU2_K18A4NU43hO4zPmA_N5SkuqO_';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? fallbackSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? fallbackSupabaseAnonKey;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[supabase] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY não definidos. Usando fallback.');
}

console.info('[supabase] cliente inicializado', {
  url: supabaseUrl,
  hasAnonKey: Boolean(supabaseAnonKey),
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
