-- Mi Gym — agrega masa muscular esquelética, agua corporal en kg, y guarda hora exacta de medición.
-- Pegar en el SQL Editor de Supabase y ejecutar una sola vez, después de schema_body_metrics.sql.

alter table body_metrics add column skeletal_muscle_mass_kg numeric(6, 2);
alter table body_metrics add column body_water_kg numeric(6, 2);

alter table body_metrics alter column measured_at type timestamptz using measured_at::timestamptz;
alter table body_metrics alter column measured_at set default now();
