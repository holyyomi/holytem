import { Metadata } from 'next'
import { getProductsByCategorySlug } from '@/lib/server-products'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination'

type Props = { params: { slug: string }, searchParams: { page?: string } }

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `HolyTem • ${params.slug}`,
    description: `카테고리(${params.slug}) 선물 목록`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? '1'))
  const pageSize = 12

  const { items, total } = await getProductsByCategorySlug(params.slug, page, pageSize)

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">카테고리: {params.slug}</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          아직 등록된 제품이 없어요. 곧 채워질 예정입니다 :)
        </div>
      ) : (
        <>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center gap-2">
            <Pagination total={total} page={page} pageSize={pageSize} />
          </div>
        </>
      )}
    </main>
  )
}
