import { defineMiddleware } from 'astro:middleware';
import { bindOrphansInHtml } from './lib/typography';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  return new Response(bindOrphansInHtml(await response.text()), { status: response.status, headers: response.headers });
});
