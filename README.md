# Mi Gym

PWA-lite mobile-first para llevar tu entrenamiento: rutinas semanales con sesión guiada paso a paso, catálogo de ejercicios con GIF de demostración, progreso de peso y de composición corporal, notas, y recordatorio para revisar la rutina cada 3 meses.

## Funcionalidades

- **Login**: email + contraseña con Supabase Auth, toggle iniciar sesión / crear cuenta.
- **Inicio**: saludo según la hora, días sin entrenar, tarjeta "Hoy es {día}" con acceso directo a **Iniciar entrenamiento**, series de la semana, y actividad reciente.
- **Rutina** (3 pestañas):
  - **Hoy** — ejercicios del día según la rutina activa.
  - **Ejercicios** — catálogo propio (nombre + grupo muscular), cada uno con detalle: récord personal, GIF de demostración, formulario para registrar series y su historial.
  - **Rutinas** — crear/renombrar/activar/eliminar rutinas, agregar ejercicios por día (reutilizando el catálogo), descargar la rutina activa y el historial de series + notas en CSV, y el contador de revisión de 3 meses con botón para reiniciarlo.
- **Sesión guiada** (`/sesion`): recorre los ejercicios de hoy en orden, serie por serie, con formulario de registro prellenado con lo último cargado, timer de descanso configurable por ejercicio, y progreso que sobrevive a una recarga de página (se guarda en el navegador).
- **Progreso**: gráfica de peso por ejercicio, y una sección de **Cuerpo** para mediciones de báscula (peso, grasa corporal, masa muscular total y esquelética, grasa visceral, cintura-cadera, agua corporal en % y en kg) con su propia gráfica por métrica.
- **Notas**: generales o ligadas a un ejercicio.
- **Perfil**: foto, nombre completo, nombre de usuario, cerrar sesión.

## Stack

- Vite + React 19 + TypeScript
- React Router (rutas protegidas)
- Supabase (Auth + Postgres con Row Level Security + Storage para avatares y GIFs)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `src/index.css` vía `@theme`)
- framer-motion (transiciones y feedback táctil)
- recharts (gráficas de progreso, lazy-loaded)
- date-fns (locale es)

## Puesta en marcha

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Crear el proyecto en Supabase y correr el schema**

   Andá a [supabase.com](https://supabase.com), creá un proyecto, abrí el **SQL Editor** y corré estos archivos de `supabase/`, **en este orden** (cada uno una sola vez):

   | # | Archivo | Qué hace |
   |---|---|---|
   | 1 | `schema.sql` | Tablas base: `exercises`, `workout_sets`, `notes` + RLS |
   | 2 | `schema_profiles.sql` | Tabla `profiles` + bucket de Storage `avatars` |
   | 3 | `schema_routines_1_enum.sql` | Grupos musculares extra (tríceps, bíceps, glúteo, metabólico) |
   | 4 | `schema_routines_2_data.sql` | Tablas `routines` y `routine_exercises` + RLS. Al final trae una carga de datos de ejemplo — reemplazá el email placeholder por el tuyo (**Authentication → Users**) o borrá ese bloque si preferís cargar tu rutina a mano desde la app |
   | 5 | `schema_routines_2b_reload_data.sql` | Solo si el paso 4 falló a mitad de camino (tablas creadas pero sin datos) — reintenta nada más la carga |
   | 6 | `schema_session.sql` | `rest_seconds` y `gif_url` (para el timer y las GIF de la sesión guiada) + bucket `exercise-gifs` |
   | 7 | `schema_routine_cycle.sql` | `cycle_started_at` en `routines` — recordatorio de revisión cada 3 meses |
   | 8 | `schema_body_metrics.sql` | Tabla `body_metrics` |
   | 9 | `schema_body_metrics_2_extend.sql` | Masa muscular esquelética, agua corporal en kg, fecha con hora |
   | 10 | `schema_body_metrics_3_data.sql` | Opcional — carga una medición de ejemplo (mismo mecanismo de email placeholder) |

   Los archivos `_data`/`_reload_data` son cargas puntuales de ejemplo con un email hardcodeado como placeholder; no son necesarios para que la app funcione, solo para no arrancar con la app vacía.

   En **Authentication → Providers**, confirmá que Email esté habilitado. Si tenés activado "Confirm email", los usuarios nuevos deben confirmar su correo antes de poder iniciar sesión (la pantalla de login ya contempla ese flujo).

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores de **Project Settings → API** de tu proyecto Supabase (usá la **publishable key**, no la `secret`/`service_role`).

4. **Correr en desarrollo**

   ```bash
   npm run dev
   ```

5. **Build de producción**

   ```bash
   npm run build
   ```

## Despliegue en Vercel

El repo incluye `vercel.json` con el rewrite necesario para que las rutas de React Router (`/rutina`, `/ejercicios/:id`, `/sesion`, etc.) no den 404 al recargar. Configurá las mismas variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en el dashboard de Vercel antes de desplegar, e importá el repo desde GitHub (build command `npm run build`, output `dist`, detectado automáticamente por ser un proyecto Vite).

Después del deploy, agregá la URL de producción en **Supabase → Authentication → URL Configuration → Redirect URLs**.

## Estructura

```
src/
  routes/        pantallas: Login, Home, Routine (Hoy/Ejercicios/Rutinas), Exercises,
                 ExerciseDetail, Session, Progress (Ejercicio/Cuerpo), Notes, Profile
  components/
    ui/          Button, Input, Select, Card, Badge, Avatar, Timer
    layout/      AppShell, BottomNav, ProtectedRoute, PageTransition
    features/    componentes por pantalla (exercises, sets, notes, home, progress,
                 body, routine, routine-manager, session)
  lib/           cliente Supabase, fechas/horarios (incl. ciclo de revisión de rutina),
                 export a CSV, wrappers de API por tabla, estado de sesión guiada
  context/       AuthProvider (sesión de Supabase)
  hooks/         useExercises, useSets, useNotes, useProfile, useBodyMetrics,
                 useRoutines, useRoutineExercises, useActiveRoutine
  types/         tipos de las tablas de Supabase
supabase/
  schema*.sql    tablas, índices, políticas RLS y buckets de Storage (ver tabla arriba)
design-tokens.json  sistema de diseño (primitivos → semánticos → componente)
```
