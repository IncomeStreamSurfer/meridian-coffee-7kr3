import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const email = (body.email ?? '').toString().trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: 'That email looks off — try again.' }, 400);
  }

  const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !anon) {
    return json({ error: 'Server misconfigured.' }, 500);
  }

  const supabase = createClient(url, anon, { auth: { persistSession: false } });

  const { error } = await supabase
    .from('meridian_subscribers')
    .insert({ email, source: 'landing' });

  if (error) {
    // Unique-constraint violation → treat as already subscribed (idempotent success)
    if (error.code === '23505' || /duplicate/i.test(error.message)) {
      return json({ ok: true, already: true });
    }
    console.error('[subscribe] insert failed:', error);
    return json({ error: 'Could not save your email — try again.' }, 500);
  }

  // Fire-and-forget welcome email; don't block success response if Resend is flaky
  sendWelcomeEmail(email).catch((e) => console.error('[subscribe] welcome email failed:', e));

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
