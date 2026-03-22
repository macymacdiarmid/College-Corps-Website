-- Admin allowlist table
create table if not exists admin_users (
  email text primary key
);

-- Insert the two authorized admins
insert into admin_users (email) values
  ('mmacdiar@calpoly.edu'),
  ('shegg@calpoly.edu');

-- Enable RLS
alter table admin_users enable row level security;

-- Any authenticated user can check if they are an admin (needed for the frontend auth check)
create policy "allow authenticated read admin_users"
  on admin_users for select to authenticated using (true);

-- Drop the old broad authenticated policies and replace with admin-only
drop policy if exists "allow authenticated read contact_submissions" on contact_submissions;
drop policy if exists "allow authenticated read applications" on applications;
drop policy if exists "allow authenticated read newsletters" on newsletters;
drop policy if exists "allow authenticated read chat_messages" on chat_messages;
drop policy if exists "allow authenticated insert newsletters" on newsletters;
drop policy if exists "allow authenticated update newsletters" on newsletters;
drop policy if exists "allow authenticated delete newsletters" on newsletters;

-- Only emails in admin_users can read sensitive tables
create policy "allow admin read contact_submissions"
  on contact_submissions for select to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));

create policy "allow admin read applications"
  on applications for select to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));

create policy "allow admin read newsletters_admin"
  on newsletters for select to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));

create policy "allow admin read chat_messages"
  on chat_messages for select to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));

-- Only admins can manage newsletters
create policy "allow admin insert newsletters"
  on newsletters for insert to authenticated
  with check (exists (select 1 from admin_users where email = auth.email()));

create policy "allow admin update newsletters"
  on newsletters for update to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));

create policy "allow admin delete newsletters"
  on newsletters for delete to authenticated
  using (exists (select 1 from admin_users where email = auth.email()));
