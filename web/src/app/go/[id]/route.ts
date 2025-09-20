import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase.admin";
import { randomUUID } from "crypto";

const RATE_KEY = "last_click_ts";
const RATE_WINDOW_MS = 3000; // 3s

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const admin = supabaseAdmin();

  // 제품 + 카테고리 slug
  const { data: p } = await admin
    .from("products")
    .select("id,partner_url,category_id, categories:category_id(slug)")
    .eq("id", params.id)
    .maybeSingle();

  if (!p?.partner_url || !/^https?:\/\//.test(p.partner_url)) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL), 302);
  }

  // 세션 & 쓰로틀
  const cookieStore = cookies();
  let sid = cookieStore.get("sid")?.value;
  if (!sid) sid = randomUUID();

  const now = Date.now();
  const last = Number(cookieStore.get(RATE_KEY)?.value || 0);
  if (now - last < RATE_WINDOW_MS) {
    return new NextResponse("연속 클릭이 제한되었습니다. 잠시 후 다시 시도해 주세요.", { status: 429 });
  }

  const ref = headers().get("referer") || null;
  const ua  = headers().get("user-agent") || null;

  await admin.from("click_logs").insert({
    product_id: p.id,
    session_id: sid,
    referrer: ref,
    user_agent: ua,
  });

  // UTM merge (파트너 쿼리 보존)
  const url = new URL(p.partner_url);
  const campaign = (p as any).categories?.slug || String(p.category_id);
  if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "holytem");
  if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", "referral");
  if (!url.searchParams.has("utm_campaign")) url.searchParams.set("utm_campaign", campaign);
  if (!url.searchParams.has("utm_content")) url.searchParams.set("utm_content", String(p.id));

  const res = NextResponse.redirect(url.toString(), 302);
  res.cookies.set("sid", sid, { httpOnly: true, sameSite: "lax", maxAge: 60*60*24*365, path: "/" });
  res.cookies.set(RATE_KEY, String(now), { httpOnly: true, sameSite: "lax", maxAge: 60, path: "/" });
  return res;
}
