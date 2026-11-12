import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const getSupabaseEnv = () => {
  const viteUrl = import.meta.env.VITE_SUPABASE_URL;
  const viteKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url = viteUrl;
  const key = viteKey;

  if (!url || !key) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  return { url, key };
};

let client: SupabaseClient<Database> | undefined;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!client) {
    const { url, key } = getSupabaseEnv();
    client = createClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
};

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
};

export const getSupabaseStorageBucket = (): string =>
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'project-media';
