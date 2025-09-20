"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}&sort=priority&page=1`);
    inputRef.current?.blur();
  }

  return (
    <form onSubmit={submit} className="relative w-full sm:w-80">
      <input ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="선물 키워드를 검색하세요"
        className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm
                   outline-none transition focus:border-zinc-400"
      />
      <button type="submit"
        className="absolute right-1 top-1 rounded-full px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
      >
        검색
      </button>
    </form>
  );
}
