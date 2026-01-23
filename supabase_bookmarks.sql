-- BOOKMARKS TABLE
-- Allows Pro users to save bookmarks across sessions/devices.

create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  file_signature text not null, -- Composite key: "filename_filesize"
  line_number int not null,
  chunk_offset bigint not null, -- Critical for virtualization
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.bookmarks enable row level security;

-- VIEW: Users can see only their own bookmarks
create policy "Users can view own bookmarks" on public.bookmarks
  for select using (auth.uid() = user_id);

-- INSERT: Users can insert their own bookmarks
create policy "Users can insert own bookmarks" on public.bookmarks
  for insert with check (auth.uid() = user_id);

-- DELETE: Users can delete their own bookmarks
create policy "Users can delete own bookmarks" on public.bookmarks
  for delete using (auth.uid() = user_id);

-- INDEX for faster lookups
create index bookmarks_file_signature_idx on public.bookmarks (user_id, file_signature);
