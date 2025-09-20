"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TABS = [
  { slug: "season",  label: "🌟 시즌템" },
  { slug: "parents", label: "❤️ 효도템" },
  { slug: "kids",    label: "🧸 키즈템" },
  { slug: "pets",    label: "🐾 댕냥템" },
  { slug: "gadget",  label: "✨ 신기템" },
];

export default function Header() {
  const pathname = usePathname();
  const active = pathname?.startsWith("/t/") ? pathname.split("/")[2] : "";
  const sc = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolling(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b ${scrolling ? "backdrop-blur-sm bg-white/85" : "bg-white/90"}`}>
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💛</span>
          <span className="font-bold text-2xl">HolyTem</span>
        </Link>

        {/* 데스크톱 탭 */}
        <nav className="hidden md:flex items-center gap-5">
          {TABS.map(t => {
            const on = active === t.slug;
            return (
              <Link key={t.slug}
                href={`/t/${t.slug}`}
                className={`inline-flex items-center gap-1 font-semibold text-[18px] px-1.5 pb-2 border-b-2
                  ${on ? "text-brand.brown border-brand.gold bg-[#FFF8E1] rounded-t"
                       : "text-gray-800 border-transparent hover:text-brand.brown hover:border-brand.gold"}`}
              >
                {t.label}
              </Link>
            );
          })}
          <Link href="/collections"
            className={`inline-flex items-center gap-1 font-semibold text-[18px] px-1.5 pb-2 border-b-2
              ${pathname?.startsWith("/collections") ? "text-brand.brown border-brand.gold bg-[#FFF8E1] rounded-t"
              : "text-gray-800 border-transparent hover:text-brand.brown hover:border-brand.gold"}`}>
            🗂️ 컬렉션
          </Link>
        </nav>
      </div>

      {/* 모바일 가로 스크롤 + 페이드 힌트 */}
      <div className="md:hidden relative">
        <div ref={sc} className="flex gap-3 overflow-x-auto px-4 py-2 scroll-smooth">
          {TABS.map(t => {
            const on = active === t.slug;
            return (
              <Link key={t.slug}
                href={`/t/${t.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-[15px] border
                ${on ? "bg-[#FFF8E1] border-brand.gold text-brand.brown"
                     : "bg-white border-neutral-line text-gray-800 hover:border-brand.gold"}`}
              >
                {t.label}
              </Link>
            );
          })}
          <Link href="/collections" className="shrink-0 rounded-full px-4 py-2 text-[15px] bg-white border border-neutral-line">
            🗂️ 컬렉션
          </Link>
        </div>
        {/* 좌우 페이드 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </header>
  );
}
