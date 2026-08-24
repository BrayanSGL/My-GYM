export type MuscleGroup =
  | 'pecho'
  | 'espalda'
  | 'piernas'
  | 'hombros'
  | 'brazos'
  | 'core'
  | 'cardio'
  | 'otro'

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: 'pecho', label: 'Pecho' },
  { value: 'espalda', label: 'Espalda' },
  { value: 'piernas', label: 'Piernas' },
  { value: 'hombros', label: 'Hombros' },
  { value: 'brazos', label: 'Brazos' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'otro', label: 'Otro' },
]

export interface Exercise {
  id: string
  user_id: string
  name: string
  muscle_group: MuscleGroup
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
