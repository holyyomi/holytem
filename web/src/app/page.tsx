"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { supabaseClient } from "@/lib/supabase.client";
import { Product } from '@/lib/server-products'; // Product 타입을 server-products에서 가져옵니다.

type Promo = {
  id: number;
  title: string;
  image_url: string | null;
  link_url: string | null;
};
type Setting = { key: string; value: string };

const CATEGORIES = [
  { slug: "season",  name: "🌟 시즌템" },
  { slug: "parents", name: "❤️ 효도템" },
  { slug: "kids",    name: "🧸 키즈템" },
  { slug: "pets",    name: "🐾 댕냥템" },
  { slug: "gadget",  name: "✨ 신기템" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const { data: f } = await supabaseClient.rpc("get_home_featured");
      setFeatured((f || []) as Product[]);

      const { data: s } = await supabaseClient
        .from("settings")
        .select("key,value")
        .in("key", ["hero_title", "hero_subtitle", "footer_notice"]);
      const map: Record<string, string> = {};
      (s || []).forEach((r: Setting) => (map[r.key] = r.value));
      setSettings(map);

      fetch("/api/promos")
        .then((r) => r.json())
        .then(setPromos);
    })();
  }, []);

  const heroTitle = settings["hero_title"] || "선물은 여기서 끝낸다.";
  const heroSub =
    settings["hero_subtitle"] ||
    "물어볼 필요 없이, 상황·대상별로 딱 맞는 선물만 골라드립니다.";

  return (
    <div className="space-y-10 py-10">
      {/* 히어로 */}
      <section className="text-center py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {heroTitle}
        </h1>
        <p className="mt-3 text-zinc-600">{heroSub}</p>
      </section>

      {/* 카테고리 칩 */}
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1
                 text-sm text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 추천 선물 */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">추천 선물</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 프로모션 */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold">프로모션</h2>
        {promos.length === 0 ? (
          <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed text-zinc-400">
            프로모션 카드가 없습니다.
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((pr) => (
              <a
                key={pr.id}
                href={pr.link_url || "#"}
                target="_blank"
                rel="noopener sponsored"
                className="block rounded-2xl border bg-white/70 backdrop-blur transition hover:shadow-md"
              >
                <img
                  src={pr.image_url || "/placeholder.jpg"}
                  alt={pr.title}
                  className="h-auto w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-3 font-semibold">{pr.title}</div>
              </a>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
