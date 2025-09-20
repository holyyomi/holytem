'use client';
import { useEffect, useState } from 'react';

type P = {
  id:number; title:string; category_id:number; image_url:string|null; short_copy:string|null;
  partner_url:string|null; is_best:boolean; priority:number; hidden:boolean; status:string;
};

const CATS = [
  { id: 1, slug:'season',  name:'시즌템' },
  { id: 2, slug:'parents', name:'효도템' },
  { id: 3, slug:'kids',    name:'키즈템' },
  { id: 4, slug:'pets',    name:'댕냥템' },
  { id: 5, slug:'gadget',  name:'신기템' },
];

export default function AdminPage() {
  const [items,setItems]=useState<P[]>([]);
  const [editing,setEditing]=useState<Partial<P>|null>(null);
  const [imgWarn,setImgWarn]=useState<string| null>(null);
  const [check,setCheck]=useState<{score:number; notes:string[]}|null>(null);

  const load = async () => {
    const res = await fetch('/admin/api/products', { cache:'no-store' });
    setItems(await res.json());
  };

  useEffect(()=>{ load(); },[]);

  const onUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/admin/api/upload', { method:'POST', body: fd });
    const j = await res.json();
    if (file.size > 1_000_000) setImgWarn('이미지 용량이 1MB를 초과했습니다. 가능한 한 줄이는 것을 권장합니다.');
    return j.url;
  };

  const quality = (p: Partial<P>) => {
    const notes:string[] = [];
    let score = 100;
    const t = (p.title||'').trim();
    if (t.length < 4) { score-=20; notes.push('제목이 너무 짧습니다.'); }
    const sc = (p.short_copy||'').trim();
    if (!sc.includes('\n')) { score-=15; notes.push('short_copy는 3줄 템플릿을 권장합니다.'); }
    if ((p.image_url||'').length < 10) { score-=15; notes.push('이미지 없음.'); }
    if ((p.partner_url||'').startsWith('http')===false) { score-=15; notes.push('파트너 링크 확인 필요.'); }
    if (/(최저가|가격)/.test(t+sc)) { score-=20; notes.push('가격/최저가 문구 금지.'); }
    return { score: Math.max(0,score), notes };
  };

  const save = async () => {
    if (!editing) return;
    const mode = editing.id ? 'PUT':'POST';
    const url = editing.id ? `/admin/api/products/${editing.id}`:'/admin/api/products';
    const res = await fetch(url, { method: mode, headers:{ 'content-type':'application/json' }, body: JSON.stringify(editing) });
    const j = await res.json();
    if (res.ok) { setEditing(null); await load(); alert('저장 완료'); }
    else alert('오류: '+(j.error||''));
  };

  const linkCheck = async () => {
    if (!editing?.partner_url) return;
    const res = await fetch('/admin/api/link-check', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ url: editing.partner_url })});
    const j = await res.json();
    alert(`링크 상태: ${j.status} ${j.ok ? 'OK' : 'NG'}`);
  };

  useEffect(()=>{ if (editing) setCheck(quality(editing)); },[editing]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">관리자</h1>

      <div className="mb-6">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>setEditing({ status:'draft', priority:9999, is_best:false, hidden:false })}>+ 상품 추가</button>
        <a className="ml-3 underline" href="/admin/api/export/products">CSV 백업 다운로드</a>
      </div>

      {editing && (
        <div className="border rounded-xl p-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">카테고리</label>
              <select value={editing.category_id||1} onChange={e=>setEditing({...editing, category_id:Number(e.target.value)})} className="border rounded p-2 w-full">
                {CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="block text-sm font-semibold mt-3 mb-1">제목</label>
              <input className="border rounded p-2 w-full" value={editing.title||''} onChange={e=>setEditing({...editing, title:e.target.value})}/>

              <label className="block text-sm font-semibold mt-3 mb-1">짧은 설명 (3줄 템플릿)</label>
              <textarea className="border rounded p-2 w-full h-28" value={editing.short_copy||''}
                onChange={e=>setEditing({...editing, short_copy:e.target.value})}
                placeholder={`① 누구에게/언제\n② 왜 좋은가(효용 1문장)\n③ 주의 포인트(1문장)`} />

              <label className="block text-sm font-semibold mt-3 mb-1">파트너 링크 (http/https)</label>
              <div className="flex gap-2">
                <input className="border rounded p-2 w-full" value={editing.partner_url||''} onChange={e=>setEditing({...editing, partner_url:e.target.value})}/>
                <button className="px-3 py-2 border rounded" onClick={linkCheck}>링크 검사</button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.is_best} onChange={e=>setEditing({...editing, is_best:e.target.checked})}/> 대표(is_best)
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  우선순위 <input type="number" className="border rounded p-1 w-20" value={editing.priority||9999} onChange={e=>setEditing({...editing, priority:Number(e.target.value)})}/>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  숨김 <input type="checkbox" checked={!!editing.hidden} onChange={e=>setEditing({...editing, hidden:e.target.checked})}/>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  상태
                  <select className="border rounded p-1" value={editing.status||'draft'} onChange={e=>setEditing({...editing, status:e.target.value})}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">이미지(3:2)</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={async e=>{
                  const f = e.target.files?.[0]; if (!f) return;
                  const url = await onUpload(f);
                  setEditing({...editing, image_url:url});
                }}/>
                {imgWarn && <span className="text-xs text-red-600">{imgWarn}</span>}
              </div>
              {editing.image_url && <img src={editing.image_url} className="mt-2 w-full aspect-[3/2] object-cover rounded" alt="미리보기" />}

              {check && (
                <div className="mt-4 border rounded p-3">
                  <div className="font-semibold">품질 점수: {check.score}/100</div>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                    {check.notes.map((n,i)=><li key={i}>{n}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button className="px-3 py-2 rounded bg-[#D4AF37] text-white" onClick={save}>저장</button>
                {editing.id && <a className="px-3 py-2 border rounded" href={`/p/${editing.id}?preview=1`} target="_blank">미리보기</a>}
                <button className="px-3 py-2 border rounded" onClick={()=>setEditing(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-2">상품 목록</h2>
      <table className="w-full text-sm border">
        <thead><tr className="bg-gray-50"><th className="p-2">ID</th><th>제목</th><th>상태</th><th>대표</th><th>우선</th><th>수정</th></tr></thead>
        <tbody>
          {items.map(p=>(
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.status}</td>
              <td className="p-2">{p.is_best?'Y':'-'}</td>
              <td className="p-2">{p.priority}</td>
              <td className="p-2">
                <button className="px-2 py-1 border rounded" onClick={()=>setEditing(p)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
