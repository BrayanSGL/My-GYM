import type { WorkoutSet } from '@/types/database'

export const SUGGESTION_SET_COUNT = 5

export function averagePlaceholders(sets: WorkoutSet[]): { weight: string; reps: string } | null {
  if (sets.length === 0) return null
  const avgWeight = sets.reduce((sum, s) => sum + s.weight, 0) / sets.length
  const avgReps = sets.reduce((sum, s) => sum + s.reps, 0) / sets.length
  return { weight: String(Math.round(avgWeight * 2) / 2), reps: String(Math.round(avgReps)) }
}
