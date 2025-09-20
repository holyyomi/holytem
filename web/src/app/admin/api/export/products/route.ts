import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.admin';

export async function GET() {
  const admin = supabaseAdmin();
  const { data } = await admin.from('products').select('*').order('id', { ascending: true });
  const rows = (data||[]).map(r => [
    r.id, JSON.stringify(r.title), r.category_id, r.image_url, JSON.stringify(r.short_copy),
    r.partner_url, r.is_best, r.priority, r.hidden, r.status, r.created_at, r.updated_at
  ].join(','));
  const csv = ['id,title,category_id,image_url,short_copy,partner_url,is_best,priority,hidden,status,created_at,updated_at', ...rows].join('\n');
  return new NextResponse(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename=products.csv' }});
}
