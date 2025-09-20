import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";
import { searchProducts, SortKey } from "@/src/lib/search";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; sort?: SortKey };
}) {
  const q = searchParams.q ?? "";
  const page = Number(searchParams.page ?? "1");
  const sort = (searchParams.sort as SortKey) ?? "priority";

  const { items, total, totalPages } = await searchProducts({ q, page, sort });

  return (
    <div className="py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">검색 결과</h1>
          <p className="mt-1 text-sm text-zinc-600">
            “{q || "전체"}” 검색 · 총 {total}개
          </p>
        </div>

        {/* 정렬 */}
        <nav className="flex gap-2 text-sm">
          {[
            { k: "priority", label: "우선순위" },
            { k: "new", label: "최신" },
            { k: "popular", label: "인기" },
          ].map(({ k, label }) => {
            const active = sort === (k as SortKey);
            const href = `/search?q=${encodeURIComponent(q)}&sort=${k}&page=1`;
            return (
              <Link key={k}
                href={href}
                className={`rounded-full border px-3 py-1 ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 리스트 */}
      {items.length === 0 ? (
        <div className="mt-10 flex h-48 items-center justify-center rounded-lg border border-dashed text-zinc-400">
          결과가 없습니다.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            const href = `/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${n}`;
            const active = n === page;
            return (
              <Link key={n}
                href={href}
                className={`h-9 w-9 rounded-full text-center text-sm leading-9 ${
                  active
                    ? "bg-black text-white"
                    : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {n}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
