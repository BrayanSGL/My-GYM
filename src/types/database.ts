export type MuscleGroup =
  | 'pecho'
  | 'espalda'
  | 'piernas'
  | 'hombros'
  | 'brazos'
  | 'triceps'
  | 'biceps'
  | 'gluteo'
  | 'core'
  | 'cardio'
  | 'metabolico'
  | 'otro'

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: 'pecho', label: 'Pecho' },
  { value: 'espalda', label: 'Espalda' },
  { value: 'piernas', label: 'Piernas' },
  { value: 'hombros', label: 'Hombros' },
  { value: 'brazos', label: 'Brazos' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'gluteo', label: 'Glúteo' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'metabolico', label: 'Metabólico' },
  { value: 'otro', label: 'Otro' },
]

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
]

export interface Exercise {
  id: string
  user_id: string
  name: string
  muscle_group: MuscleGroup
  gif_url: string | null
  created_at: string
}

export interface WorkoutSet {
  id: string
  user_id: string
  exercise_id: string
  weight: number
  reps: number
  rpe: number | null
  set_date: string
  note: string | null
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  exercise_id: string | null
  content: string
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  updated_at: string
}

export interface Routine {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
}

export interface RoutineExercise {
  id: string
  user_id: string
  routine_id: string
  exercise_id: string
  day_of_week: DayOfWeek
  order_index: number
  scheme_text: string
  rest_text: string | null
  rest_seconds: number | null
  technique_notes: string | null
  active: boolean
  created_at: string
}

export interface BodyMetric {
  id: string
  user_id: string
  measured_at: string
  weight_kg: number | null
  body_fat_pct: number | null
  muscle_mass_kg: number | null
  skeletal_muscle_mass_kg: number | null
  visceral_fat: number | null
  waist_hip_ratio: number | null
  body_water_pct: number | null
  body_water_kg: number | null
  note: string | null
  created_at: string
}

export type BodyMetricKey =
  | 'weight_kg'
  | 'body_fat_pct'
  | 'muscle_mass_kg'
  | 'skeletal_muscle_mass_kg'
  | 'visceral_fat'
  | 'waist_hip_ratio'
  | 'body_water_pct'
  | 'body_water_kg'

export const BODY_METRIC_FIELDS: { key: BodyMetricKey; label: string; unit: string }[] = [
  { key: 'weight_kg', label: 'Peso corporal', unit: 'kg' },
  { key: 'body_fat_pct', label: 'Grasa corporal', unit: '%' },
  { key: 'muscle_mass_kg', label: 'Masa muscular', unit: 'kg' },
  { key: 'skeletal_muscle_mass_kg', label: 'Masa muscular esquelética', unit: 'kg' },
  { key: 'visceral_fat', label: 'Grasa visceral', unit: '' },
  { key: 'waist_hip_ratio', label: 'Relación cintura-cadera', unit: '' },
  { key: 'body_water_pct', label: 'Agua corporal (%)', unit: '%' },
  { key: 'body_water_kg', label: 'Agua corporal (kg)', unit: 'kg' },
]
