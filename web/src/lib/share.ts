export type ShareInput = { url: string; title?: string; text?: string };

export function buildShareUrls({ url, title = '', text = '' }: ShareInput) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || text || '');
  return {
    naver: `https://share.naver.com/web/share?url=${u}&title=${t}`,
    kakaoStory: `https://story.kakao.com/share?url=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
  };
}

export async function webShare({ url, title, text }: ShareInput) {
  if (navigator.share) {
    try {
      await navigator.share({ url, title, text });
      return true;
    } catch {
      /* cancel */
    }
  }
  return copy(url);
}

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    t.remove();
    return true;
  }
}
