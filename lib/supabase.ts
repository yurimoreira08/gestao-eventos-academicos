import { createClient } from '@supabase/supabase-js';

// Essas variáveis vêm do arquivo .env.local que você configurou com as chaves do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);