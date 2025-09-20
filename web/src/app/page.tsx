"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { supabaseClient } from "@/lib/supabase.client";

type Product = {
  id: number;
  title: string;
  image_url: string | null;
  short_copy: string | null;
  is_best: boolean | null;
  priority: number | null;
};
type Promo = {
  id: number;
  title: string;
  image_url: string | null;
  link_url: string | null;
};

const TABS = [
  { slug: "season", label: "🌟 시즌템" },
  { slug: "parents", label: "❤️ 효도템" },
  { slug: "kids", label: "🧸 키즈템" },
  { slug: "pets", label: "🐾 댕냥템" },
  { slug: "gadget", label: "✨ 신기템" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 대표 5개
      try {
        const { data, error } = await supabaseClient.rpc("get_home_featured");
        if (!error && data?.length) {
          setFeatured(data);
        } else {
          const { data: fallback } = await supabaseClient
            .from("products")
            .select("id,title,image_url,short_copy,is_best,priority")
            .eq("is_best", true)
            .eq("hidden", false)
            .eq("status", "published")
            .order("priority", { ascending: true })
            .order("created_at", { ascending: false })
            .limit(5);
          setFeatured(fallback || []);
        }
      } finally {
        setLoading(false);
      }

      // 프로모션
      const res = await fetch("/api/promos", { cache: "no-store" });
      const j = await res.json();
      setPromos(j || []);
    })();
  }, []);

  return (
    <div className="space-y-10">
      {/* 히어로 */}
      <section className="text-center pt-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8C6A00]">
          선물은 여기서 끝낸다.
        </h1>
        <p className="mt-2 text-gray-700">
          물어볼 필요 없이, 상황·대상별로 딱 맞는 선물만 골라드립니다.
        </p>
      </section>

      {/* 카테고리 탭 */}
      <section className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.slug}
            href={`/t/${t.slug}`}
            className="rounded-full border px-3 py-1 text-sm font-medium hover:border-[#D4AF37] hover:text-[#8C6A00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            {t.label}
          </Link>
        ))}
      </section>

      {/* 추천 5개 */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">추천 선물</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
            {!featured.length && (
              <div className="text-sm text-gray-500">
                대표 상품이 아직 없어요. 관리자에서 <code>is_best</code>로
                지정해 주세요.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 프로모션 */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">프로모션</h2>
        {promos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map((pr) => (
              <a
                key={pr.id}
                href={pr.link_url || "#"}
                className="block overflow-hidden rounded-2xl border bg-white/70 hover:shadow-md"
              >
                <img
                  src={pr.image_url || "/placeholder.jpg"}
                  alt={pr.title}
                  className="h-36 w-full object-cover"
                />
                <div className="p-3 font-semibold">{pr.title}</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex h-36 items-center justify-center rounded-2xl border text-gray-500">
            프로모션 카드가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
