// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log di sicurezza (solo in fase di debug, puoi rimuoverlo più tardi)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variabili Supabase mancanti:", { supabaseUrl, supabaseAnonKey });
}

// Crea client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
