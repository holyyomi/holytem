import type { Metadata } from 'next';
import { supabaseClient } from '@/lib/supabase.client';

async function getProduct(id: string, preview?: string) {
  // preview는 관리자 전용(동일 IP+Basic Auth 세션)에서만 사용한다고 가정
  let q = supabaseClient.from('products').select('*').eq('id', id).maybeSingle();
  if (!preview) q = q.eq('status', 'published').eq('hidden', false);
  const { data } = await q;
  return data;
}

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const p = await getProduct(params.id, searchParams?.preview);
  const title = p?.title || '상품';
  const desc = (p?.short_copy || '').slice(0, 150);
  const img = p?.image_url || '/og-default.jpg';
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [{ url: img, width: 1200, height: 630 }] }
  };
}

export default async function ProductPage({ params, searchParams }: any) {
  const p = await getProduct(params.id, searchParams?.preview);
  if (!p) return <div className="py-10">상품을 찾을 수 없어요.</div>;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: p.image_url ? [p.image_url] : [],
    description: p.short_copy || '',
    brand: 'HolyTem',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <img src={p.image_url || '/placeholder.jpg'} alt={p.title} className="w-full aspect-[3/2] object-cover rounded-xl"/>
      <h1 className="mt-4 text-2xl font-bold">{p.title}</h1>
      {p.short_copy && (
        <div className="mt-2 text-gray-700 whitespace-pre-wrap">
          {p.short_copy}
        </div>
      )}

      <div className="mt-6">
        <a href={`/go/${p.id}`} className="inline-flex items-center px-4 py-3 rounded-lg bg-[#D4AF37] text-white hover:bg-[#C9A227]">
          자세히 보기
        </a>
        <p className="mt-2 text-xs text-gray-500">※ 일부 콘텐츠에는 파트너 링크가 포함될 수 있습니다.</p>
      </div>
    </div>
  );
}
