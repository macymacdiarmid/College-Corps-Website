-- ─────────────────────────────────────────
-- Chatbot messages table
-- ─────────────────────────────────────────

create table if not exists chat_messages (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null,
  question     text not null,
  answer       text,
  created_at   timestamptz not null default now(),
  answered_at  timestamptz
);

alter table chat_messages enable row level security;

-- Anyone (including anonymous visitors) can submit a question
create policy "anyone submit chat"
  on chat_messages for insert to anon, authenticated
  with check (true);

-- Anyone can read messages (needed to poll for answers by session)
create policy "anyone read chat"
  on chat_messages for select to anon, authenticated
  using (true);

-- Admins can update (to answer) and delete
create policy "admin manage chat"
  on chat_messages for all to authenticated
  using (exists (select 1 from public.admin_users where email = auth.email()))
  with check (exists (select 1 from public.admin_users where email = auth.email()));
