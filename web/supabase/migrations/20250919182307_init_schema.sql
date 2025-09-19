-- categories
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text unique not null, -- season/parents/kids/pets/gadget
  description text,
  created_at timestamptz default now()
);

-- products
create table if not exists public.products (
  id bigserial primary key,
  title text not null,
  category_id bigint not null references public.categories(id) on delete cascade,
  image_url text,
  short_copy text,
  partner_url text,
  is_best boolean default false,
  priority int default 9999,
  hidden boolean default false,
  status text default 'published', -- 'draft'|'published'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- seasons (컬렉션/가이드 용도)
create table if not exists public.seasons (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  year_label text
);

create table if not exists public.season_products (
  season_id bigint references public.seasons(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  primary key (season_id, product_id)
);

-- promos
create table if not exists public.promos (
  id bigserial primary key,
  title text not null,
  image_url text,
  link_url text,
  position int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- settings
create table if not exists public.settings (
  id bigserial primary key,
  key text unique not null,
  value text not null
);

-- click_logs
create table if not exists public.click_logs (
  id bigserial primary key,
  product_id bigint references public.products(id) on delete set null,
  session_id text,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

-- 홈 대표 5개(카테별 is_best 중 priority 낮은 순 상위1)
create or replace function public.get_home_featured()
returns setof products
language sql
stable
as supabase/migrations
  with x as (
    select p.*,
           row_number() over (partition by c.id order by p.priority asc, p.created_at desc) as rn
    from products p
    join categories c on c.id = p.category_id
    where p.is_best = true and p.hidden=false and p.status='published'
    and c.slug in ('season','parents','kids','pets','gadget')
  )
  select * from x where rn = 1 limit 5;
supabase/migrations;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.seasons enable row level security;
alter table public.season_products enable row level security;
alter table public.promos enable row level security;
alter table public.settings enable row level security;
alter table public.click_logs enable row level security;

-- 공개 SELECT 허용 (읽기 전용)
create policy cat_select on public.categories for select using (true);
create policy prod_select on public.products for select using (status='published' and hidden = false);
create policy seas_select on public.seasons for select using (true);
create policy seasprod_select on public.season_products for select using (true);
create policy promo_select on public.promos for select using (active = true);
create policy set_select on public.settings for select using (true);

-- click_logs는 공개 INSERT 허용
create policy click_insert_any on public.click_logs for insert with check (true);

-- 관리자 CUD는 Service Role로만 (RLS 우회하므로 정책 불필요)

insert into public.categories (name, slug, description) values
('시즌템','season','다가오는 시즌에 맞춘 선물 가이드와 추천 아이템.'),
('효도템','parents','부모님께 드리기 좋은 선물 추천.'),
('키즈템','kids','아이에게 인기 있는 선물 추천.'),
('댕냥템','pets','반려가족을 위한 선물 추천.'),
('신기템','gadget','호기심과 편의를 채우는 기발한 아이템.')
on conflict (slug) do nothing;