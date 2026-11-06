-- Run this in Supabase SQL Editor before enabling cloud backup.
create table if not exists public.user_books (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  book_data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);
alter table public.user_books enable row level security;
drop policy if exists "Users can read their own books" on public.user_books;
create policy "Users can read their own books" on public.user_books for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own books" on public.user_books;
create policy "Users can insert their own books" on public.user_books for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own books" on public.user_books;
create policy "Users can update their own books" on public.user_books for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own books" on public.user_books;
create policy "Users can delete their own books" on public.user_books for delete using (auth.uid() = user_id);

-- Restrict Data API access to signed-in users; RLS still enforces per-user rows.
revoke all on table public.user_books from anon, public;
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.user_books to authenticated;
