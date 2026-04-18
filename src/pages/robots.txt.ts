import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.PUBLIC_SITE_URL ?? site?.toString() ?? 'https://meridian-coffee.vercel.app';
  const body = `User-agent: *
Allow: /

Sitemap: ${base.replace(/\/$/, '')}/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
