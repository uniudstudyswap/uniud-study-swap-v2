import { createClient } from '@supabase/supabase-js';

// URL e chiave pubblica del tuo progetto Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // mantiene l’utente loggato
    autoRefreshToken: true,     // rinnova il token automaticamente
    detectSessionInUrl: true,   // rileva la sessione dopo l'accesso con Google
  },
});

export default supabase;
