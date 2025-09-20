import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase.client';

export default async function CollectionDetail({ params }: { params: { slug: string }}) {
  const { data: s } = await supabaseClient.from('seasons').select('id,name,slug,year_label').eq('slug', params.slug).maybeSingle();
  if (!s) return <div className="py-10">컬렉션이 없습니다.</div>;
  const { data: items } = await supabaseClient
    .from('season_products')
    .select('product_id, products!inner(id,title,image_url,short_copy)')
    .eq('season_id', s.id)
    .order('product_id', { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">{s.name} {s.year_label ? `· ${s.year_label}` : ''}</h1>
      <p className="mt-2 text-gray-700">상황 설명 한 줄을 여기에 기입하세요.</p>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {(items||[]).map((sp:any) => (
          <li key={sp.product_id}>
            <Link href={`/p/${sp.products.id}`} className="block border rounded-xl p-3 hover:shadow-sm">
              <img src={sp.products.image_url || '/placeholder.jpg'} alt={sp.products.title} className="w-full aspect-[3/2] object-cover rounded-md"/>
              <h3 className="mt-2 font-semibold line-clamp-1">{sp.products.title}</h3>
              {sp.products.short_copy && <p className="text-xs text-gray-600 line-clamp-2">{sp.products.short_copy}</p>}
            </Link>
          </li>
        ))}
      </ul>
      {/* 비슷한 컬렉션 3개는 후속: 같은 prefix로 3개 추천 등 */}
    </div>
  );
}
