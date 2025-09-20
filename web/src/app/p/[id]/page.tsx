import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { getProductById, getSimilarProducts } from '@/lib/server-products';
import { share } from '@/lib/share';
import { Suspense } from 'react';
import { logClick } from '@/lib/track'; // 클릭 로깅을 위한 import 추가

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  const product = await getProductById(id);
  const title = product?.title ? `${product.title} | HolyTem` : '상품 상세 | HolyTem';
  const description = product?.short_copy ?? '상황·대상별 딱 맞는 선물만 고르는 HolyTem';
  const images = product?.image_url ? [{ url: product.image_url }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images: images?.[0]?.url },
  };
}

export default async function Page({ params }: Props) {
  const id = Number(params.id);
  const product = await getProductById(id);
  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-2xl font-bold">상품을 찾을 수 없어요</h1>
        <p className="mt-2 text-muted-foreground">삭제되었거나 비공개 처리된 상품일 수 있어요.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-foreground px-4 py-2 text-background">
          홈으로
        </Link>
      </main>
    );
  }

  const similars = product.category_id
    ? await getSimilarProducts(product.category_id, product.id, 8)
    : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* 헤더 영역 */}
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery src={product.image_url} alt={product.title} />
        <section>
          <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
          {product.short_copy && <p className="mt-3 text-base text-muted-foreground">{product.short_copy}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {product.partner_url && (
              <a href={product.partner_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logClick(product.id)} // 클릭 로깅 추가
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
              >
                구매하러 가기
              </a>
            )}

            {/* 공유 */}
            <button onClick={() => share({ title: product.title, text: product.short_copy ?? undefined })}
              className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              공유하기
            </button>
          </div>

          {/* 주의/책임고지 (settings에서 가져오는 고급형은 16단계에 연동됨) */}
          <p className="mt-6 text-xs text-muted-foreground">
            ※ 본 페이지의 외부 링크는 제휴 링크일 수 있으며, 구매 시 일정 커미션을 받을 수 있습니다. 제품 정보는 판매처 공지에 따릅니다.
          </p>
        </section>
      </div>

      {/* 유사 추천 */}
      {similars.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-semibold">비슷한 추천</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similars.map((p) => (
              <ProductCard key={p.id} id={p.id} title={p.title} image_url={p.image_url} short_copy={p.short_copy} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
