import { supabaseClient } from '@/lib/supabase.client';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const { data: prods } = await supabaseClient.from('products').select('id').eq('hidden', false).eq('status','published').limit(1000);
  const urls = [
    `${base}/`,
    `${base}/t/season`, `${base}/t/parents`, `${base}/t/kids`, `${base}/t/pets`, `${base}/t/gadget`,
    `${base}/collections`,
    ...(prods||[]).map(p => `${base}/p/${p.id}`),
  ].map(u => `<url><loc>${u}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}
