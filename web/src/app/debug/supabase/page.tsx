"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase.client";

export default function SupabaseDebugPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        // 1) 간단 조회: categories에서 1건만 가져오기
        const { data, error } = await supabaseClient
          .from("categories")
          .select("id, name, slug")
          .limit(1);

        if (error) throw error;

        setStatus("ok");
        setMsg(`OK ✅  categories 1건 조회 성공: ${JSON.stringify(data)}`);
      } catch (err: any) {
        setStatus("error");
        setMsg(`ERROR ❌ ${err?.message || String(err)}`);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase 연결 점검</h1>
      <p>ENV URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "존재" : "없음"}</p>
      <p>ENV ANON: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "존재" : "없음"}</p>
      <hr />
      <p>상태: <b>{status}</b></p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{msg}</pre>
      <p style={{marginTop:16, color:"#666"}}>
        * 이 페이지는 점검용입니다. 통신 확인 후 삭제하세요.
      </p>
    </main>
  );
}
