import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    // Next 13+ 에서 권장: remotePatterns (보다 유연)
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      // Supabase Storage 공개 버킷 이미지 (프로젝트별 호스트 자동 주입)
      ...(supabaseHost
        ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
        : []),
      // 필요하면 추가 도메인 여기 더 넣기
      // { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
