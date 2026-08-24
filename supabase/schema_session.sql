-- Mi Gym — sesión guiada de entrenamiento: descanso en segundos (para el timer) + GIF por ejercicio.
-- Pegar en el SQL Editor de Supabase y ejecutar una sola vez, después de los scripts anteriores.

-- 1) Segundos de descanso para el timer (rest_text sigue existiendo para mostrar el texto original)
alter table routine_exercises add column rest_seconds integer;

update routine_exercises set rest_seconds = 180 where rest_text = 'Descanso 2–3 min';
update routine_exercises set rest_seconds = 120 where rest_text = 'Descanso 2 min';
update routine_exercises set rest_seconds = 120 where rest_text = 'Descanso 1:30–2 min';
update routine_exercises set rest_seconds = 90 where rest_text = 'Descanso 1:30 min';
update routine_exercises set rest_seconds = 60 where rest_text = 'Descanso 1 min';
update routine_exercises set rest_seconds = 45 where rest_text = 'Descanso 45 s';
-- Los ejercicios de circuito (Viernes) quedan sin rest_seconds: la app ofrece un descanso
-- manual ajustable en pantalla cuando no hay un valor configurado.

-- 2) GIF de demostración por ejercicio
alter table exercises add column gif_url text;

insert into storage.buckets (id, name, public)
values ('exercise-gifs', 'exercise-gifs', true)
on conflict (id) do nothing;

create policy "exercise_gifs_public_read" on storage.objects
  for select using (bucket_id = 'exercise-gifs');

create policy "exercise_gifs_owner_insert" on storage.objects
  for insert with check (bucket_id = 'exercise-gifs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "exercise_gifs_owner_update" on storage.objects
  for update using (bucket_id = 'exercise-gifs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "exercise_gifs_owner_delete" on storage.objects
  for delete using (bucket_id = 'exercise-gifs' and auth.uid()::text = (storage.foldername(name))[1]);
