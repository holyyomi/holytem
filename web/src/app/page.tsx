"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { supabaseClient } from "@/lib/supabase.client";

type Product = { id:number; title:string; image_url:string|null; short_copy:string|null; category_id:number; is_best:boolean|null; priority:number|null; created_at:string };
type Category = { id:number; slug:string; name:string; };
type Promo = { id:number; title:string; image_url:string|null; link_url:string|null; };
type Setting = { key:string; value:string; };

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [settings, setSettings] = useState<Record<string,string>>({});

  useEffect(() => {
    (async () => {
      const { data: f } = await supabaseClient.rpc('get_home_featured');
      setFeatured((f||[]) as Product[]);

      const { data: s } = await supabaseClient.from("settings").select("key,value").in("key", ["hero_title","hero_subtitle","footer_notice"]);
      const map: Record<string,string> = {};
      (s||[]).forEach((r:Setting)=> map[r.key]=r.value);
      setSettings(map);

      fetch("/api/promos").then(r=>r.json()).then(setPromos);
    })();
  }, []);

  const heroTitle = settings["hero_title"] || "선물은 여기서 끝낸다.";
  const heroSub   = settings["hero_subtitle"] || "물어볼 필요 없이, 상황·대상별로 딱 맞는 선물만 골라드립니다.";

  return (
    <div className="space-y-10">
      {/* 히어로 */}
      <section className="text-center pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand.brown">{heroTitle}</h1>
        <p className="mt-3 text-[17px] text-neutral-44">{heroSub}</p>
      </section>

      {/* 상황 칩 */}
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2">
          {[ "#부모님","#연인","#아이","#반려가족","#집들이","#퇴사/입사","#장거리운전"].map((s,i)=>(
            <Link key={i} href="/collections" className="rounded-full border px-4 py-2 bg-white hover:shadow-sm">{s}</Link>
          ))}
        </div>
      </section>

      {/* 대표 5개 */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {featured.map(p => (
          <ProductCard key={p.id} id={p.id} title={p.title} image_url={p.image_url} short_copy={p.short_copy} is_best={p.is_best||false} created_at={p.created_at} />
        ))}
      </section>

      {/* 프로모션 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">프로모션</h2>
        {promos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map(pr => (
              <a key={pr.id} href={pr.link_url||"#"} target="_blank" rel="noopener sponsored" className="block border rounded-2xl overflow-hidden bg-white">
                <img src={pr.image_url||"/placeholder.jpg"} alt={pr.title} className="w-full h-[140px] object-cover"/>
                <div className="p-3 font-semibold">{pr.title}</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="h-[140px] border rounded-2xl flex items-center justify-center text-gray-500 bg-white">
            프로모션 카드가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
