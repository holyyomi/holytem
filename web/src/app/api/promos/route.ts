import { supabaseClient } from '@/lib/supabase.client';
export async function GET() {
  const { data } = await supabaseClient.from('promos').select('id,title,image_url,link_url').eq('active', true).order('position', { ascending: true }).limit(10);
  return new Response(JSON.stringify(data||[]), { headers:{'content-type':'application/json'} });
}
