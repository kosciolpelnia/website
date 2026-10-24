import type { APIRoute } from 'astro';
import { publicSongs } from '../lib/catalog';
import { nav } from '../data/nav';

export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', ...nav.map((n) => n.href), '/polityka-prywatnosci', ...(await publicSongs()).map((s) => `/uwielbienie/${s.slug}`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
