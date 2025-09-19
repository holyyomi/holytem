"use client";
import Link from "next/link";
// import { Gift } from 'lucide-react'; // 제거

const TABS = [
  { slug: "season", label: "🌟 시즌템" },
  { slug: "parents", label: "❤️ 효도템" },
  { slug: "kids", label: "🧸 키즈템" },
  { slug: "pets", label: "🐾 댕냥템" },
  { slug: "gadget", label: "✨ 신기템" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💛</span>
          <span className="font-bold text-2xl">HolyTem</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {TABS.map((t) => (
            <Link
              key={t.slug}
              href={`/t/${t.slug}`}
              className="inline-flex items-center gap-1 font-semibold text-[18px] text-gray-800 hover:text-[#8C6A00] border-b-2 border-transparent hover:border-[#D4AF37]"
            >
              {t.label}
            </Link>
          ))}
          <Link
            href="/collections"
            className="font-semibold text-[18px] hover:text-[#8C6A00]"
          >
            🗂️ 컬렉션
          </Link>
        </nav>
      </div>
    </header>
  );
}
