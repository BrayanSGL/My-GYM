-- Mi Gym — Paso 1 de 2 para cargar rutinas.
-- Corré este archivo solo, ejecutalo, y RECIÉN DESPUÉS pegá y corré schema_routines_2_data.sql.
-- (Van separados porque Postgres no permite usar un valor de enum nuevo en la misma
-- transacción en la que se lo agrega.)

alter type muscle_group add value if not exists 'triceps';
alter type muscle_group add value if not exists 'biceps';
alter type muscle_group add value if not exists 'gluteo';
alter type muscle_group add value if not exists 'metabolico';
