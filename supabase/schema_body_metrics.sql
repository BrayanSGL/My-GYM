-- Mi Gym — mediciones corporales (báscula de bioimpedancia).
-- Pegar en el SQL Editor de Supabase y ejecutar una sola vez, además de los scripts anteriores.

create table body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_at date not null default current_date,
  weight_kg numeric(6, 2),
  body_fat_pct numeric(4, 1) check (body_fat_pct is null or (body_fat_pct >= 0 and body_fat_pct <= 100)),
  muscle_mass_kg numeric(6, 2),
  visceral_fat numeric(4, 1),
  waist_hip_ratio numeric(4, 2),
  body_water_pct numeric(4, 1) check (body_water_pct is null or (body_water_pct >= 0 and body_water_pct <= 100)),
  note text,
  created_at timestamptz not null default now()
);

create index body_metrics_user_id_idx on body_metrics(user_id);
create index body_metrics_measured_at_idx on body_metrics(measured_at);

alter table body_metrics enable row level security;

create policy "body_metrics_owner" on body_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
