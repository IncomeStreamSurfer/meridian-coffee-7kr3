# Meridian Coffee — Coming Soon

A coming-soon landing page for **Meridian**, a specialty coffee brand launching in 2026.
Editorial dark/light aesthetic, email capture wired to Supabase, optional welcome email via Resend.

## Stack

- **Astro 6** (server output) on **Vercel**
- **Tailwind v4** via `@tailwindcss/vite`
- **Supabase** for the subscriber list (`meridian_subscribers` table)
- **Resend** for the welcome email (uses `onboarding@resend.dev` — no domain verification required)

## What was built

- Single-page landing at `/` with hero, brand story (Origin / Craft / Ritual), first-release manifest, and two email capture blocks
- Dark/light theme toggle (respects `prefers-color-scheme`, remembered in `localStorage`)
- `/api/subscribe` endpoint — validates, inserts into `meridian_subscribers`, fires welcome email
- `/sitemap.xml` and `/robots.txt` generated dynamically from `PUBLIC_SITE_URL`
- Schema.org `Organization` JSON-LD on every page
- Grain texture + custom font stack (Fraunces serif headings + Inter body)

## Harbor content table

A `meridian_content` table lives in the same Supabase project (`title`, `slug`, `body`, `seo_description`, `published_at`). The site doesn&rsquo;t surface a blog yet, but this is the hook Harbor will use to publish articles into the site later.

## Local dev

```bash
npm install
cp .env.example .env  # fill in values
npm run dev
```

## Deploy

Pushed to GitHub and deployed to Vercel. Env vars required in Vercel:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_SITE_URL`
- `RESEND_API_KEY`

## Next steps (manual)

- Connect a custom domain in Vercel and update `PUBLIC_SITE_URL`
- Verify a sending domain in Resend and swap the `FROM` in `src/lib/email.ts` to `hello@yourdomain.com`
- Add a confirmation opt-in flow if GDPR double opt-in is required
- Wire a blog route (`/journal/[slug]`) off `meridian_content` when content starts shipping
