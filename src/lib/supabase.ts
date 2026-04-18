import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(url ?? '', anon ?? '', {
  auth: { persistSession: false },
});

export type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export type ContentRow = {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
};
