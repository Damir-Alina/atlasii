-- AtlasIQ — Stage 9 schema
-- Run via the Supabase CLI: supabase db push
-- or paste into the Supabase Dashboard SQL editor.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- profiles
-- One row per auth user. Created automatically by the trigger at the
-- bottom of this file, so the app never needs to INSERT here directly.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  full_name          text not null default '',
  avatar_url         text,
  level              integer not null default 1,
  xp                 integer not null default 0,
  xp_to_next_level   integer not null default 600,
  total_xp           integer not null default 0,
  total_correct      integer not null default 0,
  total_answered     integer not null default 0,
  streak_days        integer not null default 0,
  best_streak_days   integer not null default 0,
  last_active_date   date,
  is_premium         boolean not null default false,
  role               text not null default 'user' check (role in ('user', 'admin')),
  settings           jsonb not null default '{}'::jsonb,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  accuracy           numeric(5, 4) generated always as (
    case when total_answered > 0
      then round(total_correct::numeric / total_answered, 4)
      else 0
    end
  ) stored
);

-- ─────────────────────────────────────────────────────────────────────────
-- categories — the 5 learning categories (regions, cities, rivers, lakes,
-- mountains). Seeded in supabase/seed.sql.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  icon             text not null,
  total_questions  integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- questions — one row per learnable map object (a region, city, river,
-- lake or mountain). Mirrors src/lib/map/regions.ts + geo-objects.ts.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on delete cascade,
  type          text not null,
  target_name   text not null,
  lng           double precision not null,
  lat           double precision not null,
  fact          text,
  created_at    timestamptz not null default now()
);

create index if not exists questions_category_id_idx on public.questions (category_id);

-- ─────────────────────────────────────────────────────────────────────────
-- results — one row per completed learning session.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.results (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  category_id    uuid references public.categories (id) on delete set null,
  category_name  text not null,
  accuracy       numeric(4, 3) not null check (accuracy >= 0 and accuracy <= 1),
  xp_earned      integer not null default 0,
  correct_count  integer not null default 0,
  total_count    integer not null default 0,
  duration_seconds integer not null default 0,
  completed_at   timestamptz not null default now()
);

create index if not exists results_user_id_completed_at_idx
  on public.results (user_id, completed_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- achievements — static definitions, seeded in supabase/seed.sql.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.achievements (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null,
  icon          text not null,
  goal          integer not null default 1,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- user_achievements — per-user progress/unlock state against a definition.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  achievement_id  uuid not null references public.achievements (id) on delete cascade,
  progress        integer not null default 0,
  unlocked        boolean not null default false,
  unlocked_at     timestamptz,
  unique (user_id, achievement_id)
);

create index if not exists user_achievements_user_id_idx on public.user_achievements (user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- profiles: name/avatar/stats are visible to everyone (needed for the
-- leaderboard) — there's no email or other PII on this table. Only the
-- owner can ever update their own row.
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories & questions & achievements: public read-only reference data.
create policy "categories_select_all" on public.categories
  for select using (true);

create policy "questions_select_all" on public.questions
  for select using (true);

create policy "achievements_select_all" on public.achievements
  for select using (true);

-- results: a user can read/insert only their own rows. No update/delete —
-- completed sessions are immutable history.
create policy "results_select_own" on public.results
  for select using (auth.uid() = user_id);

create policy "results_insert_own" on public.results
  for insert with check (auth.uid() = user_id);

-- user_achievements: a user can read/insert/update only their own rows.
create policy "user_achievements_select_own" on public.user_achievements
  for select using (auth.uid() = user_id);

create policy "user_achievements_insert_own" on public.user_achievements
  for insert with check (auth.uid() = user_id);

create policy "user_achievements_update_own" on public.user_achievements
  for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Admin access (Stage 13)
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Admins can update any profile (role/premium toggles), on top of the
-- existing "update your own row" policy.
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

-- Admins manage reference data; everyone else keeps read-only access via
-- the "*_select_all" policies created above.
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "questions_admin_write" on public.questions
  for all using (public.is_admin()) with check (public.is_admin());

create policy "achievements_admin_write" on public.achievements
  for all using (public.is_admin()) with check (public.is_admin());

-- Admins can see every result (platform analytics), on top of each user
-- already being able to see their own via "results_select_own".
create policy "results_select_admin" on public.results
  for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- Auto-create a profile row whenever a new auth user signs up (email,
-- Google OAuth — both go through auth.users the same way).
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at current on every profiles write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Period leaderboard (weekly / monthly) — aggregates results.xp_earned per
-- user within a rolling window. A SQL function because this GROUP BY can't
-- be expressed through the PostgREST query builder directly.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.get_period_leaderboard(
  days_back integer,
  result_limit integer default 10,
  result_offset integer default 0
)
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  period_xp bigint,
  total_count bigint
)
language sql
stable
security definer set search_path = public
as $$
  with period_totals as (
    select
      r.user_id,
      sum(r.xp_earned) as period_xp
    from public.results r
    where r.completed_at >= now() - make_interval(days => days_back)
    group by r.user_id
  )
  select
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    pt.period_xp,
    count(*) over () as total_count
  from period_totals pt
  join public.profiles p on p.id = pt.user_id
  order by pt.period_xp desc
  limit result_limit
  offset result_offset;
$$;
