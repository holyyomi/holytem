import { supabaseClient } from '@/lib/supabase.client';
import Link from 'next/link';

const PAGE_SIZE = 18;

export default async function CategoryPage({ params, searchParams }: \
 { params: { slug: string }, searchParams: { page?: string, sort?: string }}) {
  const page = Number(searchParams.page || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const sort = (searchParams.sort || 'latest') as 'latest'|'priority';

  // 카테고리 조회
  const { data: cats } = await supabaseClient.from('categories').select('id,slug,name,description').eq('slug', params.slug).maybeSingle();
  if (!cats) return <div className="py-10">없는 카테고리입니다.</div>;

  let query = supabaseClient.from('products').select('id,title,image_url,short_copy,category_id,is_best,priority').eq('category_id', cats.id).eq('hidden', false).eq('status','published');
  if (sort === 'priority') query = query.order('priority', { ascending: true }).order('created_at', { ascending: false });
  else query = query.order('created_at', { ascending: false });
  query = query.range(from, to);
  const { data: items } = await query;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{cats.name}</h1>
        {cats.description && <p className="mt-2 text-gray-700">{cats.description}</p>}
        {/* 탭별 컬렉션 타이틀/설명 1줄은 settings에서 불러와 상단에 한 줄 노출(후속 Step 8에서 settings UI로 관리) */}
      </div>
      <div className="flex items-center gap-3 text-sm mb-4">
        <Link href={`?sort=latest`} className={sort==='latest'?'font-semibold':''}>최신순</Link>
        <Link href={`?sort=priority`} className={sort==='priority'?'font-semibold':''}>추천순</Link>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(items||[]).map(p => (
          <li key={p.id}>
            <Link href={`/p/${p.id}`} className="block border rounded-xl p-3 hover:shadow-sm">
              <img src={p.image_url || '/placeholder.jpg'} alt={p.title} className="w-full aspect-[3/2] object-cover rounded-md"/>
              <h3 className="mt-2 font-semibold line-clamp-1">{p.title}</h3>
              {p.short_copy && <p className="text-xs text-gray-600 line-clamp-2">{p.short_copy}</p>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-3 mt-6">
        {page>1 && <Link href={`?page=${page-1}&sort=${sort}`} className="px-3 py-1 border rounded">이전</Link>}
        {(items||[]).length===PAGE_SIZE && <Link href={`?page=${page+1}&sort=${sort}`} className="px-3 py-1 border rounded">다음</Link>}
      </div>
    </div>
  );
}
