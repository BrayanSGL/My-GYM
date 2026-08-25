-- Mi Gym — ciclo de revisión de rutina (recordatorio cada 3 meses).
-- Pegar en el SQL Editor de Supabase y ejecutar una sola vez.

alter table routines add column cycle_started_at timestamptz not null default now();
