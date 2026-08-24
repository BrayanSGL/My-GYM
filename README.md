# Mi Gym

PWA-lite mobile-first para registrar entrenamientos: ejercicios, series (peso/reps/RPE), progreso en el tiempo y notas.

## Stack

- Vite + React 19 + TypeScript
- React Router (rutas protegidas)
- Supabase (Auth + Postgres con Row Level Security)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `src/index.css` vía `@theme`)
- framer-motion (transiciones y feedback táctil)
- recharts (gráfica de progreso, lazy-loaded)
- date-fns (locale es)

## Puesta en marcha

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Crear el proyecto en Supabase**

   - Andá a [supabase.com](https://supabase.com), creá un proyecto nuevo.
   - Abrí el **SQL Editor** y pegá el contenido de `supabase/schema.sql`. Ejecutalo una sola vez — crea las tablas `exercises`, `workout_sets` y `notes`, sus índices y las políticas de Row Level Security.
   - En **Authentication → Providers**, confirmá que Email esté habilitado. Si tenés activado "Confirm email", los usuarios nuevos van a tener que confirmar su correo antes de poder iniciar sesión (la pantalla de login ya contempla ese flujo).

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores de **Project Settings → API** de tu proyecto Supabase.

4. **Correr en desarrollo**

   ```bash
   npm run dev
   ```

5. **Build de producción**

   ```bash
   npm run build
   ```

## Despliegue en Vercel

El repo incluye `vercel.json` con el rewrite necesario para que las rutas de React Router (`/ejercicios/:id`, etc.) no den 404 al recargar. Configurá las mismas variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en el dashboard de Vercel antes de desplegar.

## Estructura

```
src/
  routes/        pantallas (Login, Home, Exercises, ExerciseDetail, Notes, Progress)
  components/
    ui/          Button, Input, Select, Card, Badge
    layout/      AppShell, BottomNav, ProtectedRoute, PageTransition
    features/    componentes específicos de cada pantalla
  lib/           cliente Supabase, helpers de fecha, wrappers de API por tabla
  context/       AuthProvider (sesión de Supabase)
  hooks/         useExercises, useSets, useNotes
  types/         tipos de las tablas de Supabase
supabase/
  schema.sql     tablas, índices y políticas RLS
design-tokens.json  sistema de diseño (primitivos → semánticos → componente)
```
