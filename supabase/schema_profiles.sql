-- Mi Gym — agrega perfil de usuario (nombre completo, username, foto).
-- Pegar en el SQL Editor de Supabase y ejecutar una sola vez, además de schema.sql.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_owner_select" on profiles
  for select using (auth.uid() = id);

create policy "profiles_owner_insert" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_owner_update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Bucket público para fotos de perfil. Cada usuario solo puede escribir dentro de su propia carpeta ({user_id}/...).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_owner_insert" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
