-- Make newsletters.published_at nullable so drafts are supported
alter table newsletters alter column published_at drop not null;

-- Authenticated users (admins) can read all tables
create policy "allow authenticated read contact_submissions"
  on contact_submissions for select to authenticated using (true);

create policy "allow authenticated read applications"
  on applications for select to authenticated using (true);

create policy "allow authenticated read newsletters"
  on newsletters for select to authenticated using (true);

create policy "allow authenticated read chat_messages"
  on chat_messages for select to authenticated using (true);

-- Authenticated users can insert/update/delete newsletters
create policy "allow authenticated insert newsletters"
  on newsletters for insert to authenticated with check (true);

create policy "allow authenticated update newsletters"
  on newsletters for update to authenticated using (true);

create policy "allow authenticated delete newsletters"
  on newsletters for delete to authenticated using (true);
