'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({ total, page, pageSize }: { total: number; page: number; pageSize: number }) {
  const router = useRouter()
  const params = useSearchParams()
  const last = Math.max(1, Math.ceil(total / pageSize))

  const go = (p: number) => {
    const qp = new URLSearchParams(params.toString())
    qp.set('page', String(p))
    router.push(`?${qp.toString()}`)
  }

  if (last <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="btn" onClick={() => go(Math.max(1, page - 1))} disabled={page <= 1}>이전</button>
      <span className="text-sm text-muted-foreground">{page} / {last}</span>
      <button className="btn" onClick={() => go(Math.min(last, page + 1))} disabled={page >= last}>다음</button>
    </div>
  )
}
