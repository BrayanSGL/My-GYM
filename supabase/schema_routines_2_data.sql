-- Mi Gym — Paso 2 de 2 para cargar rutinas.
-- Corré esto DESPUÉS de haber ejecutado schema_routines_1_enum.sql.
--
-- ANTES DE CORRERLO: reemplazá 'TU-CORREO@EJEMPLO.COM' más abajo por el email
-- con el que creaste tu cuenta en Mi Gym.

-- 1) Un ejercicio no se repite dos veces con el mismo nombre en tu catálogo
alter table exercises add constraint exercises_user_id_name_key unique (user_id, name);

-- 2) Rutinas: podés guardar varias (ej. "Fuerza", "Volumen") y marcar cuál está activa
create table routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- Solo una rutina activa por usuario a la vez
create unique index routines_one_active_per_user on routines(user_id) where is_active;

alter table routines enable row level security;

create policy "routines_owner" on routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) Ejercicios dentro de una rutina: día, orden, esquema de series/reps, descanso y notas técnicas
create table routine_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid not null references routines(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  day_of_week text not null check (day_of_week in ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')),
  order_index integer not null,
  scheme_text text not null,
  rest_text text,
  technique_notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (routine_id, exercise_id, day_of_week, order_index)
);

create index routine_exercises_routine_id_idx on routine_exercises(routine_id);
create index routine_exercises_exercise_id_idx on routine_exercises(exercise_id);
create index routine_exercises_day_idx on routine_exercises(day_of_week);

alter table routine_exercises enable row level security;

create policy "routine_exercises_owner" on routine_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) Carga de tu rutina actual (lunes a viernes)
with target_user as (
  select id as user_id from auth.users where email = 'TU-CORREO@EJEMPLO.COM'
),
target_routine as (
  insert into routines (user_id, name, is_active)
  select user_id, 'Rutina actual', true from target_user
  on conflict (user_id, name) do update set is_active = excluded.is_active
  returning id as routine_id, user_id
),
upserted_exercises as (
  insert into exercises (user_id, name, muscle_group)
  select tu.user_id, x.name, x.muscle_group::muscle_group
  from target_user tu
  cross join (values
    ('Press de banca con barra', 'pecho'),
    ('Press inclinado con mancuernas', 'pecho'),
    ('Press militar sentado con mancuernas', 'hombros'),
    ('Aperturas en máquina (pec deck)', 'pecho'),
    ('Elevaciones laterales con mancuernas', 'hombros'),
    ('Tríceps en polea (cuerda o barra)', 'triceps'),
    ('Sentadilla con barra', 'piernas'),
    ('Prensa 45°', 'piernas'),
    ('Peso muerto rumano (RDL)', 'piernas'),
    ('Extensión de cuádriceps', 'piernas'),
    ('Curl femoral en máquina', 'piernas'),
    ('Gemelos de pie', 'piernas'),
    ('Jalón al pecho (o dominada asistida)', 'espalda'),
    ('Remo con barra', 'espalda'),
    ('Remo en polea baja (agarre neutro)', 'espalda'),
    ('Pull-over en polea alta', 'espalda'),
    ('Curl de bíceps con barra', 'biceps'),
    ('Curl martillo', 'biceps'),
    ('Press militar con barra de pie', 'hombros'),
    ('Hip Thrust en máquina o barra', 'gluteo'),
    ('Face Pull', 'hombros'),
    ('Pájaro inverso (reverse fly)', 'hombros'),
    ('Plancha abdominal', 'core'),
    ('Swing con Kettlebell', 'metabolico'),
    ('Burpees', 'metabolico'),
    ('Mountain climbers', 'core'),
    ('Zancadas caminando con mancuernas', 'piernas'),
    ('Elevaciones de piernas colgado', 'core'),
    ('Plancha lateral', 'core')
  ) as x(name, muscle_group)
  on conflict (user_id, name) do update set muscle_group = excluded.muscle_group
  returning id, name
)
insert into routine_exercises
  (user_id, routine_id, exercise_id, day_of_week, order_index, scheme_text, rest_text, technique_notes, active)
select tr.user_id, tr.routine_id, ue.id, r.day_of_week, r.order_index, r.scheme_text, r.rest_text, r.technique_notes, r.active
from target_routine tr
cross join (values
  -- Lunes — Pecho
  ('Press de banca con barra', 'lunes', 1, '4 series × 6–8 reps', 'Descanso 2–3 min', 'Compuesto principal del día. Escápulas retraídas, glúteos firmes. Baja controlado y empuja con fuerza. RIR 2-3.', true),
  ('Press inclinado con mancuernas', 'lunes', 2, '3 series × 8–10 reps', 'Descanso 2 min', 'Parte superior del pecho. Codos a ~45°, recorrido amplio, controla la bajada. No choques las mancuernas arriba.', true),
  ('Press militar sentado con mancuernas', 'lunes', 3, '3 series × 8–10 reps', 'Descanso 1:30–2 min', 'Hombro anterior. Abdomen firme, sin arquear la espalda. Agarre neutro si te molestan las muñecas.', true),
  ('Aperturas en máquina (pec deck)', 'lunes', 4, '3 series × 12–15 reps', 'Descanso 1 min', 'Aislamiento de pectoral. Ligero estiramiento sin forzar el hombro, aprieta en el centro.', true),
  ('Elevaciones laterales con mancuernas', 'lunes', 5, '3 series × 12–15 reps', 'Descanso 1 min', 'Deltoide lateral. Codo ligeramente flexionado, sube hasta la línea del hombro, sin impulso.', true),
  ('Tríceps en polea (cuerda o barra)', 'lunes', 6, '3 series × 10–12 reps', 'Descanso 1 min', 'Codos pegados al cuerpo, extiende completo sin mover los hombros. Control en la vuelta.', true),
  -- Martes — Pierna
  ('Sentadilla con barra', 'martes', 1, '4 series × 6–8 reps', 'Descanso 2–3 min', 'Base del día. Espalda neutra, baja con control hasta donde la técnica te lo permita, empuja con talones. RIR 2-3.', true),
  ('Prensa 45°', 'martes', 2, '3 series × 10–12 reps', 'Descanso 2 min', 'Pies a la anchura de hombros, recorrido controlado, sin bloquear rodillas. Lumbar pegado al respaldo.', true),
  ('Peso muerto rumano (RDL)', 'martes', 3, '3 series × 8–10 reps', 'Descanso 2 min', 'Cadera atrás, espalda recta, barra cerca del cuerpo. Siente el estiramiento en isquios todo el rango.', true),
  ('Extensión de cuádriceps', 'martes', 4, '3 series × 12–15 reps', 'Descanso 1 min', 'Aislamiento. Extiende hasta casi bloquear, aprieta arriba 1 s, baja lento. Sin balanceo.', true),
  ('Curl femoral en máquina', 'martes', 5, '3 series × 12 reps', 'Descanso 1 min', 'Isquios. Contrae fuerte arriba, baja en 2 s. No arquees la espalda.', true),
  ('Gemelos de pie', 'martes', 6, '3 series × 15–20 reps', 'Descanso 45 s', 'Sube y baja completo, sin rebotes, pausa arriba.', true),
  -- Miércoles — Espalda / Bíceps
  ('Jalón al pecho (o dominada asistida)', 'miercoles', 1, '4 series × 8–10 reps', 'Descanso 2 min', 'Inicia llevando los hombros "atrás y abajo". No te recuestes. Barra al pecho con control. Si puedes, prioriza dominada asistida.', true),
  ('Remo con barra', 'miercoles', 2, '3 series × 8–10 reps', 'Descanso 2 min', 'Engrosa la espalda media. Espalda recta, core apretado, lleva la barra al ombligo contrayendo omóplatos.', true),
  ('Remo en polea baja (agarre neutro)', 'miercoles', 3, '3 series × 10–12 reps', 'Descanso 1:30 min', 'Tira hacia el ombligo, torso estable, aprieta omóplatos al final. No redondees la espalda.', true),
  ('Pull-over en polea alta', 'miercoles', 4, '3 series × 12–15 reps', 'Descanso 1 min', 'Trabajo directo del dorsal. Brazos casi rectos, tira hacia la cadera sintiendo el dorsal.', true),
  ('Curl de bíceps con barra', 'miercoles', 5, '3 series × 10–12 reps', 'Descanso 1 min', 'Codos pegados al cuerpo, sin balanceo, rango completo.', true),
  ('Curl martillo', 'miercoles', 6, '3 series × 12 reps', 'Descanso 1 min', 'Braquial y braquiorradial, mejora el agarre. Control en la bajada.', true),
  -- Jueves — Hombro / Glúteo / Core
  ('Press militar con barra de pie', 'jueves', 1, '4 series × 6–8 reps', 'Descanso 2 min', 'Compuesto de hombro. Pies anchura de hombros, core apretado, empuja sin hiperextender la espalda. Si fatiga lumbar, hazlo sentado.', true),
  ('Hip Thrust en máquina o barra', 'jueves', 2, '3 series × 8–10 reps', 'Descanso 2 min', 'Glúteo. Sube con fuerza, pausa 1 s arriba, no hiperextiendas la espalda baja.', true),
  ('Elevaciones laterales con mancuernas', 'jueves', 3, '3 series × 12–15 reps', 'Descanso 1 min', 'Segunda dosis semanal de deltoide lateral (el músculo que más "ensancha" el hombro). Controlado, sin impulso.', true),
  ('Face Pull', 'jueves', 4, '3 series × 15 reps', 'Descanso 1 min', 'Deltoide posterior y salud del hombro. Tira hacia la cara con los codos altos, aprieta atrás.', true),
  ('Pájaro inverso (reverse fly)', 'jueves', 5, '3 series × 12–15 reps', 'Descanso 1 min', 'Deltoide posterior para equilibrar el hombro. Peso ligero, siente el trabajo atrás, no en trapecios.', true),
  ('Plancha abdominal', 'jueves', 6, '3 series × 30–45 s', 'Descanso 45 s', 'Core isométrico. Glúteos apretados, sin arquear la espalda baja.', true),
  -- Viernes — Metabólico / Core / Pierna (circuito)
  ('Swing con Kettlebell', 'viernes', 1, '3–4 rondas × 15 reps', null, 'Circuito metabólico (3–4 rondas seguidas, descanso breve entre rondas). Potencia de cadera, glúteo e isquios + cardio.', true),
  ('Burpees', 'viernes', 2, '3–4 rondas × 10–12 reps', null, 'Ejercicio global, dispara pulsaciones. Buen ritmo pero con técnica: pecho al suelo abajo, salto arriba.', true),
  ('Mountain climbers', 'viernes', 3, '3–4 rondas × 20 reps (10 por pierna)', null, 'Core dinámico + cardio. Plancha alta, rodillas al pecho alternando rápido, caderas alineadas.', true),
  ('Zancadas caminando con mancuernas', 'viernes', 4, '3 series × 10–12 por pierna', null, 'Unilateral para glúteo y cuádriceps. Torso vertical, pasos amplios, baja controlado.', true),
  ('Elevaciones de piernas colgado', 'viernes', 5, '3 series × 10–15 reps', null, 'Abdomen inferior. Flexiona caderas, lumbar estable, sin balancearte. Si se agota el agarre, alterna con banco inclinado.', true),
  ('Plancha lateral', 'viernes', 6, '3 series × 30–40 s por lado', null, 'Core lateral y oblicuos. Cadera arriba, cuerpo en línea.', true)
) as r(name, day_of_week, order_index, scheme_text, rest_text, technique_notes, active)
join upserted_exercises ue on ue.name = r.name
on conflict (routine_id, exercise_id, day_of_week, order_index)
  do update set scheme_text = excluded.scheme_text, rest_text = excluded.rest_text,
                technique_notes = excluded.technique_notes, active = excluded.active;
