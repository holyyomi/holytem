'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { buildShareUrls, copy, webShare } from '@/lib/share';

export type ProductCardProps = {
  id: number;
  title: string;
  image_url?: string | null;
  short_copy?: string | null;
};

export default function ProductCard({ id, title, image_url, short_copy }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const href = `/p/${id}`;
  const shareTarget = typeof window !== 'undefined'
    ? `${location.origin}${href}`
    : href;
  const share = buildShareUrls({ url: shareTarget, title });

  return (
    <div className="group relative rounded-2xl border bg-white/70 backdrop-blur transition hover:shadow-md">
      <Link href={href} className="block">
        <div className="overflow-hidden rounded-t-2xl">
          <Image src={image_url || '/placeholder.jpg'}
            alt={title}
            width={600}
            height={400}
            className="h-auto w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-semibold">{title}</h3>
          {short_copy && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2 whitespace-pre-line">
              {short_copy}
            </p>
          )}
        </div>
      </Link>

      {/* 공유 버튼 */}
      <div className="absolute right-2 top-2">
        <button type="button"
          aria-label="공유"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border bg-white/90 px-2 py-1 text-xs font-medium shadow-sm hover:border-[#D4AF37] hover:text-[#8C6A00]"
        >
          공유
        </button>
        {open && (
          <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border bg-white text-sm shadow-lg"
            onMouseLeave={() => setOpen(false)}
          >
            <button className="block w-full px-3 py-2 text-left hover:bg-gray-50"
              onClick={async () => {
                await webShare({ url: shareTarget, title });
                setOpen(false);
              }}
            >
              시스템 공유
            </button>
            <button className="block w-full px-3 py-2 text-left hover:bg-gray-50"
              onClick={async () => {
                await copy(shareTarget);
                setOpen(false);
              }}
            >
              링크 복사
            </button>
            <a className="block px-3 py-2 hover:bg-gray-50" href={share.naver} target="_blank" rel="noreferrer">
              네이버로 공유
            </a>
            <a className="block px-3 py-2 hover:bg-gray-50" href={share.kakaoStory} target="_blank" rel="noreferrer">
              카카오스토리로 공유
            </a>
            <a className="block px-3 py-2 hover:bg-gray-50" href={share.twitter} target="_blank" rel="noreferrer">
              트위터로 공유
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
