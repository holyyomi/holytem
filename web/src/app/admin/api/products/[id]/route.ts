import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.admin';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const admin = supabaseAdmin();
  if (body.partner_url && !/^https?:\/\//.test(body.partner_url)) {
    return NextResponse.json({ error: 'invalid partner_url' }, { status: 400 });
  }
  body.updated_at = new Date().toISOString();
  const { data, error } = await admin.from('products').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = supabaseAdmin();
  const { error } = await admin.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
