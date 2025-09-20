import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export type ProductRow = {
  id: number
  title: string
  image_url: string | null
  short_copy: string | null
  partner_url: string | null
  is_best: boolean
  priority: number
  hidden: boolean
  status: string
  created_at: string
  category_id: number
}

export async function getProductsByCategorySlug(slug: string, page=1, pageSize=12) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

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
    items: filtered as ProductRow[],
    total: count ?? filtered.length,
    page,
    pageSize,
  }
}
