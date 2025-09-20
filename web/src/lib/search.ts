"use server";

import { createClient } from "@/lib/supabase.server"; // 경로 수정

export type SortKey = "priority" | "new" | "popular";

export async function searchProducts({
  q,
  page = 1,
  pageSize = 16,
  sort = "priority",
}: {
  q: string;
  page?: number;
  pageSize?: number;
  sort?: SortKey;
}) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 기본 정렬
  let order: { column: string; ascending: boolean } = { column: "priority", ascending: true };
  if (sort === "new") order = { column: "created_at", ascending: false };
  if (sort === "popular") order = { column: "id", ascending: false }; // 클릭 로그 연동 전 임시

  // 공개 정책에 맞게 status/hidden 필터
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .eq("hidden", false);

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    query = query.or(`title.ilike.${like},short_copy.ilike.${like},partner_url.ilike.${like}`);
  }

  const { data, error, count } = await query
    .order(order.column, { ascending: order.ascending })
    .range(from, to);

  if (error) throw error;

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
