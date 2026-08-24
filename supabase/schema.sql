-- Mi Gym — schema completo. Pegar una sola vez en el SQL Editor de tu proyecto Supabase y ejecutar.

create extension if not exists pgcrypto;

create type muscle_group as enum
  ('pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core', 'cardio', 'otro');

-- Catálogo de ejercicios de cada usuario
create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  muscle_group muscle_group not null,
  created_at timestamptz not null default now()
);

-- Cada serie registrada
create table workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  weight numeric(6, 2) not null,
  reps integer not null,
  rpe numeric(3, 1) check (rpe is null or (rpe >= 0 and rpe <= 10)),
  set_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

-- Notas libres, opcionalmente ligadas a un ejercicio
create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

create index exercises_user_id_idx on exercises(user_id);
create index workout_sets_user_id_idx on workout_sets(user_id);
create index workout_sets_exercise_id_idx on workout_sets(exercise_id);
create index workout_sets_set_date_idx on workout_sets(set_date);
create index notes_user_id_idx on notes(user_id);
create index notes_exercise_id_idx on notes(exercise_id);

alter table exercises enable row level security;
alter table workout_sets enable row level security;
alter table notes enable row level security;

create policy "exercises_owner" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_sets_owner" on workout_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notes_owner" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
