const RESEND_API_KEY = import.meta.env.RESEND_API_KEY as string | undefined;
const FROM = 'Meridian <onboarding@resend.dev>';

export async function sendWelcomeEmail(to: string) {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY missing — skipping send');
    return { ok: false, skipped: true };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject: 'You\'re on the list — Meridian',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #1a1613; background: #f5f1ea;">
          <div style="letter-spacing: 0.3em; font-size: 11px; text-transform: uppercase; color: #5a4e44; margin-bottom: 32px;">— Meridian</div>
          <h1 style="font-size: 28px; font-weight: 400; letter-spacing: -0.01em; margin: 0 0 24px;">You're on the list.</h1>
          <p style="line-height: 1.7; font-size: 16px; margin: 0 0 18px;">Thank you for finding us early. We're a small specialty coffee outfit building something slower, more considered — single-origin lots, roasted light, delivered fresh.</p>
          <p style="line-height: 1.7; font-size: 16px; margin: 0 0 18px;">When the first release goes live, you'll hear from us before anyone else.</p>
          <p style="line-height: 1.7; font-size: 16px; margin: 0 0 32px;">Until then — good coffee, good company.</p>
          <div style="border-top: 1px solid #d9cfbd; padding-top: 20px; font-size: 12px; color: #5a4e44;">Meridian Coffee · This address is for welcome letters only. Reply with anything — we read everything.</div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[email] Resend failed:', res.status, text);
    return { ok: false, error: text };
  }
  return { ok: true };
}
