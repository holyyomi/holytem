import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase.admin';
import { randomUUID } from 'crypto';

const RATE_KEY = 'last_click_ts';
const RATE_WINDOW_MS = 1000; // 1 rps

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const admin = supabaseAdmin();

  // 제품 조회
  const { data: p } = await admin.from('products').select('id,partner_url,category_id').eq('id', params.id).maybeSingle();
  if (!p?.partner_url || !/^https?:\/\//.test(p.partner_url)) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL), 302);
  }

  // 세션 쿠키
  const cookieStore = cookies();
  let sid = cookieStore.get('sid')?.value;
  if (!sid) sid = randomUUID();

  // 간단 레이트리밋(세션 기준)
  const now = Date.now();
  const last = Number(cookieStore.get(RATE_KEY)?.value || 0);
  if (now - last < RATE_WINDOW_MS) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const ref = headers().get('referer') || null;
  const ua  = headers().get('user-agent') || null;

  await admin.from('click_logs').insert({
    product_id: p.id,
    session_id: sid,
    referrer: ref,
    user_agent: ua,
  });

  // UTM 부착
  const url = new URL(p.partner_url);
  url.searchParams.set('utm_source','holytem');
  url.searchParams.set('utm_medium','referral');
  url.searchParams.set('utm_campaign', String(p.category_id));

  const res = NextResponse.redirect(url.toString(), 302);
  res.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', maxAge: 60*60*24*365, path: '/' });
  res.cookies.set(RATE_KEY, String(now), { httpOnly: true, sameSite: 'lax', maxAge: 60, path: '/' });
  return res;
}
