import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

export type Product = {
  id: number;
  title: string;
  image_url: string | null;
  short_copy: string | null;
  partner_url: string | null;
  is_best: boolean;
  priority: number;
  hidden: boolean;
  status: string;
  category_id: number | null;
  created_at: string | null;
};

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('hidden', false)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as Product | null;
}

export async function getSimilarProducts(categoryId: number, excludeId: number, limit = 8) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('hidden', false)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('is_best', { ascending: false })
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function getProductsByCategorySlug(slug: string, page=1, pageSize=12) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('id,title,image_url,short_copy,partner_url,is_best,priority,hidden,status,created_at,category_id, categories:category_id ( slug )', { count: 'exact' })
    .eq('hidden', false)
    .eq('status', 'published')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  // slug로 필터 (상단 select로 categories.slug 가져오지 못할 경우를 대비한 안전 필터)
  const filtered = (data ?? []).filter((r: any) => r.categories?.slug === slug)

  return {
    items: filtered as Product[], // ProductRow에서 Product로 변경
    total: count ?? filtered.length,
    page,
    pageSize,
  }
}
