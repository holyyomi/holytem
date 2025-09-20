'use client';
import Image from "next/image";
import Link from "next/link";
import { Product } from '@/lib/server-products';

export default function ProductCard({ product }: { product: Product }) {
  const { id, title, image_url, short_copy, is_best } = product;
  return (
    <Link
      href={`/p/${id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white
                 shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={image_url || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          priority={false}
        />
        {is_best && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
            BEST
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight">{title}</h3>
        {short_copy && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{short_copy}</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700">
            공유
          </span>
          <span className="text-[11px] text-zinc-400">클릭하면 상세보기</span>
        </div>
      </div>
    </Link>
  );
}
