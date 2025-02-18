import { createClient } from '@supabase/supabase-js';

// These environment variables are required for the application to work
// They should be set in the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check your .env file.');
}

// Create the Supabase client with either the real credentials or mock values
export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseAnonKey || 'mock-key'
);