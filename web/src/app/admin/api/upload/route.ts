import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.admin';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

  if (file.size > 1_000_000) { // 1MB 경고(업로드는 허용)
    // 통과시키되, 클라이언트에서 경고 표시용 플래그 전달
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `p-${Date.now()}.${ext}`;
  const admin = supabaseAdmin();
  const { data, error } = await admin.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: pub } = admin.storage.from('product-images').getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}
