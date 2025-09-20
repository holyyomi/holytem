import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.admin';

export async function GET() {
  const admin = supabaseAdmin();
  const { data } = await admin.from('products').select('*').order('created_at', { ascending: false }).limit(200);
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const payload = await req.json();
  const admin = supabaseAdmin();
  // partner_url validation
  if (payload.partner_url && !/^https?:\/\//.test(payload.partner_url)) {
    return NextResponse.json({ error: 'invalid partner_url' }, { status: 400 });
  }
  const { data, error } = await admin.from('products').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
