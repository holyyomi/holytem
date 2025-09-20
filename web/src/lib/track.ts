'use client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function logClick(productId: number, sessionId?: string) {
  try {
    await supabase.from('click_logs').insert({
      product_id: productId,
      session_id: sessionId ?? 'web',
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  } catch {
    // 로깅 실패는 사용자 동선 방해하지 않음
  }
}
