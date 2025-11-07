// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Questi valori vengono presi automaticamente dalle Environment Variables di Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Creazione del client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
