import Image from 'next/image';

export default function ProductGallery({ src, alt }: { src?: string | null; alt: string }) {
  const url = src || '/placeholder.jpg';
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image src={url} alt={alt} fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
    </div>
  );
}
