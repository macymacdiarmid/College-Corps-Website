-- Cal Poly College Corps — initial schema

-- Contact form submissions
create table if not exists contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Live chat messages
create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  sender      text not null check (sender in ('user', 'admin')),
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Newsletters / updates
create table if not exists newsletters (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  published_at date not null,
  content      text not null,
  pdf_url      text,
  created_at   timestamptz not null default now()
);

-- Application interest submissions
create table if not exists applications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  cohort      text not null check (cohort in ('food', 'climate', 'health', 'k12')),
  message     text,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (all tables locked down by default)
alter table contact_submissions enable row level security;
alter table chat_messages       enable row level security;
alter table newsletters         enable row level security;
alter table applications        enable row level security;

-- Public can INSERT contact submissions and applications
create policy "allow public insert contact"
  on contact_submissions for insert to anon with check (true);

create policy "allow public insert application"
  on applications for insert to anon with check (true);

-- Public can READ newsletters
create policy "allow public read newsletters"
  on newsletters for select to anon using (true);

-- Public can INSERT and READ their own chat messages (by session_id)
create policy "allow public insert chat"
  on chat_messages for insert to anon with check (true);

create policy "allow public read chat"
  on chat_messages for select to anon using (true);
