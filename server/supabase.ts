import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/database.types';

export interface ServerCookieStore {
  getAll(): Array<{ name: string; value: string }>;
  setAll(cookies: Array<{ name: string; value: string; options: CookieOptions }>): void;
}

export const createSupabaseServerClient = (cookies: ServerCookieStore): SupabaseClient<Database> => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase server environment variables are missing.');
  }

  return createServerClient<Database>(url, key, {
    cookies,
  });
};
