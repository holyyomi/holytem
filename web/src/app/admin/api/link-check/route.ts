import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!/^https?:\/\//.test(url)) return NextResponse.json({ ok:false, status:0, error:'invalid url' }, { status: 400 });
  try {
    const head = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return NextResponse.json({ ok: head.ok, status: head.status });
  } catch (e:any) {
    return NextResponse.json({ ok:false, status:0, error: e?.message || 'fetch error' }, { status: 500 });
  }
}
