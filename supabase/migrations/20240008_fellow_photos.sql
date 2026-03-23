-- ─────────────────────────────────────────
-- Fellow photos table
-- ─────────────────────────────────────────

create table if not exists fellow_photos (
  id           uuid primary key default gen_random_uuid(),
  fellow_email text not null,
  fellow_name  text,
  image_url    text not null,
  file_name    text,
  created_at   timestamptz not null default now()
);

alter table fellow_photos enable row level security;

-- Fellows can insert their own photos
create policy "fellows insert photos"
  on fellow_photos for insert to authenticated
  with check (fellow_email = auth.email());

-- Fellows can view their own photos
create policy "fellows view own photos"
  on fellow_photos for select to authenticated
  using (fellow_email = auth.email());

-- Admins can view and manage all photos
create policy "admin manage photos"
  on fellow_photos for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));
