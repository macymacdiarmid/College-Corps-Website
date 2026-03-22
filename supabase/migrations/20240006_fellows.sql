-- ─────────────────────────────────────────
-- Fellows table (authorized fellow logins)
-- ─────────────────────────────────────────
create table if not exists fellow_users (
  email                  text primary key,
  name                   text not null default '',
  site_name              text not null default '',
  site_supervisor        text not null default '',
  cohort                 text not null default 'food' check (cohort in ('food', 'climate', 'health', 'k12')),
  start_date             date,
  hours_required_total   integer not null default 450,
  hours_required_monthly integer not null default 45,
  monthly_deadline_day   integer not null default 1
);

-- Seed test fellow
insert into fellow_users (email, name, site_name, site_supervisor, cohort, start_date)
  values ('macygmacdiarmid@gmail.com', 'Macy MacDiarmid', 'SLO Food Bank', 'Jane Smith', 'food', current_date)
  on conflict (email) do nothing;

alter table fellow_users enable row level security;

-- Admins can fully manage fellows
create policy "admin manage fellow_users"
  on fellow_users for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- Fellows can read their own record
create policy "fellow read own record"
  on fellow_users for select to authenticated
  using (email = auth.email());

-- Auth check: any authenticated user can check if they are a fellow
create policy "auth check fellow_users"
  on fellow_users for select to authenticated
  using (true);

-- ─────────────────────────────────────────
-- Hour logs
-- ─────────────────────────────────────────
create table if not exists hour_logs (
  id            uuid primary key default gen_random_uuid(),
  fellow_email  text not null references fellow_users(email) on delete cascade,
  log_date      date not null default current_date,
  hours         numeric(5,2) not null check (hours > 0),
  description   text,
  created_at    timestamptz not null default now()
);

alter table hour_logs enable row level security;

-- Admins can manage all hour logs
create policy "admin manage hour_logs"
  on hour_logs for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- Fellows can read their own hours
create policy "fellow read own hours"
  on hour_logs for select to authenticated
  using (fellow_email = auth.email());

-- ─────────────────────────────────────────
-- Announcements
-- ─────────────────────────────────────────
create table if not exists announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  type         text not null default 'general' check (type in ('general', 'service_opportunity', 'deadline')),
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table announcements enable row level security;

-- Admins manage announcements
create policy "admin manage announcements"
  on announcements for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- Fellows and public can read published announcements
create policy "public read announcements"
  on announcements for select to authenticated, anon
  using (published_at is not null and published_at <= now());
