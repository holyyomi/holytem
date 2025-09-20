export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const body = `User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml

# noindex paths
Disallow: /admin
`;
  return new Response(body, { headers: { 'content-type': 'text/plain' } });
}
