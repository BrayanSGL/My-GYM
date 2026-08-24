-- Mi Gym — carga tu medición de báscula del 28/06/2026 20:23.
-- Corré esto DESPUÉS de schema_body_metrics_2_extend.sql.
--
-- ANTES DE CORRERLO: reemplazá 'TU-CORREO@EJEMPLO.COM' por tu email exacto
-- (copiado de Authentication → Users en el dashboard de Supabase).

insert into body_metrics (
  user_id, measured_at, weight_kg, body_fat_pct,
  muscle_mass_kg, skeletal_muscle_mass_kg,
  visceral_fat, waist_hip_ratio,
  body_water_pct, body_water_kg
)
select
  id, timestamp '2026-06-28 20:23:00', 86.6, 24.2,
  62.1, 34.2,
  11.0, 1.1,
  54.4, 47.0
from auth.users
where email = 'TU-CORREO@EJEMPLO.COM';
