import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase.client';

export default async function CollectionsPage() {
  const { data } = await supabaseClient.from('seasons').select('id,name,slug,year_label').order('id',{ascending:false}).limit(100);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🗂️ 컬렉션</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data||[]).map(s => (
          <li key={s.id} className="border rounded-xl p-4">
            <Link href={`/collections/${s.slug}`} className="font-semibold text-lg hover:text-[#8C6A00]">
              {s.name} {s.year_label ? `· ${s.year_label}` : ''}
            </Link>
            <p className="text-sm text-gray-600 mt-1">상황별 추천을 한 번에 모았습니다.</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
