"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase.client";

type Product = {
  id: number;
  title: string;
  image_url: string | null;
  short_copy: string | null;
  category_id: number;
  is_best: boolean | null;
  priority: number | null;
};
type Category = { id: number; slug: string; name: string };

export default function HomePage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    supabaseClient
      .from("categories")
      .select("id,slug,name")
      .then(({ data }) => setCats(data || []));
    // 카테별 대표 1개: is_best=true 중 priority 낮은 순 상위1
    (async () => {
      const { data } = await supabaseClient.rpc("get_home_featured"); // Step 3에서 함수 생성
      setFeatured(data || []);
    })();
  }, []);

  return (
    <div className="space-y-10">
      <section className="text-center py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8C6A00]">
          선물은 여기서 끝낸다.
        </h1>
        <p className="mt-2 text-gray-700">
          물어볼 필요 없이, 상황·대상별로 딱 맞는 선물만 골라드립니다.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {featured.map((p) => (
          <Link
            key={p.id}
            href={`/p/${p.id}`}
            className="block border rounded-xl p-3 hover:shadow-sm"
          >
            <img
              src={p.image_url || "/placeholder.jpg"}
              alt={p.title}
              className="w-full aspect-[3/2] object-cover rounded-md"
            />
            <h3 className="mt-2 font-semibold line-clamp-1">{p.title}</h3>
            {p.short_copy && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {p.short_copy}
              </p>
            )}
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">프로모션</h2>
        <div className="h-36 border rounded-xl flex items-center justify-center text-gray-500">
          프로모션 카드(수동) 자리 · 애드센스 전환 예정
        </div>
      </section>
    </div>
  );
}
