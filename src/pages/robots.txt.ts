import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://primavera-sound-atlas-2027.pages.dev');
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', origin).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
