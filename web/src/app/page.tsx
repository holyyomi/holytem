"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase.client";

/** ===== Types ===== */
// The types for Product and Category will now be inferred from the Supabase Database type.

type Promo = { id:number; title:string; image_url:string|null; link_url:string|null; };

/** ===== Page (Client Component) ===== */
export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // 1) 카테고리
        const { data: catData, error: catErr } = await supabaseClient
          .from("categories")
          .select("id, slug, name")
          .order("id", { ascending: true });

        if (catErr) throw catErr;
        if (mounted) setCategories(catData ?? []);

        // 2) 홈 대표 상품 (Step 3에서 만든 RPC)
        const { data: featData, error: featErr } = await supabaseClient.rpc(
          "get_home_featured"
        );

        if (featErr) throw featErr;
        if (mounted) setFeatured(featData ?? []); // Removed explicit type cast
      } catch (err: unknown) {
        if (mounted) {
          let message = "데이터를 불러오지 못했습니다.";
          if (err instanceof Error) {
            message = err.message;
          } else if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message: unknown }).message === "string") {
            message = (err as { message: string }).message;
          }
          setErrorMsg(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
    // 의도적으로 최초 1회만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/promos').then(r=>r.json()).then(setPromos);
  }, []);

  /** ===== UI Rendering ===== */
  return (
    <main className="space-y-10 p-6">
      {/* Header */}
      <section className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8C6A00]">
          선물은 여기서 끝낸다.
        </h1>
        <p className="mt-2 text-gray-700">
          물어볼 필요 없이, 상황·대상별로 딱 맞는 선물만 골라드립니다.
        </p>
      </section>

      {/* Error */}
      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Loading */}
      {loading && !errorMsg && (
        <div className="text-gray-500">불러오는 중…</div>
      )}

      {/* Categories */}
      {!loading && !errorMsg && categories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">카테고리</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/c/${c.slug}`}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {!loading && !errorMsg && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">추천 선물</h2>

          {featured.length === 0 ? (
            <p className="text-gray-500">표시할 추천 선물이 아직 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/p/${p.id}`}
                  className="group block overflow-hidden rounded-xl border p-3 transition hover:shadow-sm"
                >
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={p.image_url || "/placeholder.jpg"}
                      alt={p.title}
                      className="h-auto w-full aspect-[3/2] object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h3 className="mt-2 line-clamp-1 font-semibold">{p.title}</h3>
                  {p.short_copy && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {p.short_copy}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Promotion placeholder */}
      <section>
        <h2 className="text-xl font-semibold mb-3">프로모션</h2>
        {promos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map(pr => (
              <a key={pr.id} href={pr.link_url||'#'} className="block border rounded-xl overflow-hidden">
                <img src={pr.image_url||'/placeholder.jpg'} alt={pr.title} className="w-full h-36 object-cover"/>
                <div className="p-3 font-semibold">{pr.title}</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="h-36 border rounded-xl flex items-center justify-center text-gray-500">
            프로모션 카드가 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}
