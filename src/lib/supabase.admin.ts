import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL은 동일
    process.env.SUPABASE_SERVICE_ROLE!, // 서버 전용
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
