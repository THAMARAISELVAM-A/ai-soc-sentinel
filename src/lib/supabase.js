import { createClient } from '@supabase/supabase-js';

// Mission Credentials
// These should be configured in Vercel / .env as:
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("🛡️ SENTINEL_CLOUD_OFFLINE: Supabase credentials missing. Operating in localized air-gap mode.");
}

/**
 * Sentinel Uplink - The primary cloud gateway for real-time mission telemetry.
 */
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
