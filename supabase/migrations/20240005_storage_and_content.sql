-- ─────────────────────────────────────────
-- Storage buckets
-- ─────────────────────────────────────────

-- Public bucket for site images (hero, cohort photos, etc.)
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

-- Public bucket for newsletter PDFs and attachments
insert into storage.buckets (id, name, public)
  values ('newsletters', 'newsletters', true)
  on conflict (id) do nothing;

-- Admins can upload/delete from media bucket
create policy "admin upload media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.admin_users where email = auth.email())
  );

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admin_users where email = auth.email())
  );

-- Anyone can read media
create policy "public read media"
  on storage.objects for select to public
  using (bucket_id = 'media');

-- Admins can upload/delete from newsletters bucket
create policy "admin upload newsletters"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'newsletters'
    and exists (select 1 from public.admin_users where email = auth.email())
  );

create policy "admin delete newsletters"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'newsletters'
    and exists (select 1 from public.admin_users where email = auth.email())
  );

-- Anyone can read newsletter files
create policy "public read newsletters storage"
  on storage.objects for select to public
  using (bucket_id = 'newsletters');

-- ─────────────────────────────────────────
-- Site content table (CMS)
-- ─────────────────────────────────────────

create table if not exists site_content (
  section   text primary key,
  content   jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

-- Anyone can read site content (needed for frontend)
create policy "public read site_content"
  on site_content for select to anon, authenticated using (true);

-- Only admins can edit content
create policy "admin update site_content"
  on site_content for update to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()));

create policy "admin insert site_content"
  on site_content for insert to authenticated
  with check (exists (select 1 from public.admin_users where email = auth.email()));

-- ─────────────────────────────────────────
-- Seed default site content
-- ─────────────────────────────────────────

insert into site_content (section, content) values
('home_hero', '{
  "title": "Making a Difference in Our Community",
  "subtitle": "Cal Poly College Corps connects students with meaningful service opportunities across four key focus areas.",
  "cta": "Apply Now"
}'::jsonb),
('home_about', '{
  "heading": "About College Corps",
  "body": "Cal Poly College Corps is a program that places students in year-long service positions with nonprofit and government partners across San Luis Obispo County. Fellows serve 450 hours over the academic year while earning a $9,000 education award."
}'::jsonb),
('home_stats', '{
  "stats": [
    { "value": "450", "label": "Service Hours Per Year" },
    { "value": "$9,000", "label": "Education Award" },
    { "value": "4", "label": "Focus Areas" },
    { "value": "SLO", "label": "County Impact" }
  ]
}'::jsonb)
on conflict (section) do nothing;
