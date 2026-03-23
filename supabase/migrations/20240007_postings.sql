-- ─────────────────────────────────────────
-- Postings table (service opportunities, events, newsletters)
-- ─────────────────────────────────────────

create table if not exists postings (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('service_opportunity', 'event', 'newsletter')),
  title        text not null,
  description  text,
  image_url    text,
  event_date   timestamptz,
  apply_link   text,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table postings enable row level security;

-- Admins can fully manage postings
create policy "admin manage postings"
  on postings for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- Authenticated users (fellows) can read published postings
create policy "authenticated read published postings"
  on postings for select to authenticated
  using (published_at is not null and published_at <= now());
