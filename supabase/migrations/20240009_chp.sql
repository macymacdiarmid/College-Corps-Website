-- ─────────────────────────────────────────
-- CHP (Community Host Partner) users table
-- ─────────────────────────────────────────

create table if not exists chp_users (
  id       uuid primary key default gen_random_uuid(),
  email    text unique not null,
  org_name text not null,
  created_at timestamptz not null default now()
);

alter table chp_users enable row level security;

-- CHPs can read their own row
create policy "chp read own"
  on chp_users for select to authenticated
  using (email = auth.email());

-- Admins manage all
create policy "admin manage chp_users"
  on chp_users for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- Insert the first CHP
insert into chp_users (email, org_name) values ('thecpquints@gmail.com', 'Community Host Partner') on conflict do nothing;

-- ─────────────────────────────────────────
-- Link fellows to a CHP org
-- ─────────────────────────────────────────
alter table fellow_users add column if not exists chp_email text;

-- ─────────────────────────────────────────
-- Add audience column to postings
-- ('fellow', 'chp', 'all')
-- ─────────────────────────────────────────
alter table postings add column if not exists audience text not null default 'fellow'
  check (audience in ('fellow', 'chp', 'all'));
