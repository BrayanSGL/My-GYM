import type { DayOfWeek } from '@/types/database'

export type SessionPhase = 'exercising' | 'resting' | 'finished'

export interface SessionSetValues {
  weight: string
  reps: string
  rpe: string
  note: string
}

export interface PersistedSessionState {
  exerciseIndex: number
  setIndex: number
  phase: SessionPhase
  restEndsAt: number | null
  lastValues: SessionSetValues | null
}

function storageKey(routineId: string, dateKey: string, day: DayOfWeek): string {
  return `mi-gym-session:${routineId}:${dateKey}:${day}`
}

export function loadSessionState(routineId: string, dateKey: string, day: DayOfWeek): PersistedSessionState | null {
  try {
    const raw = localStorage.getItem(storageKey(routineId, dateKey, day))
    return raw ? (JSON.parse(raw) as PersistedSessionState) : null
  } catch {
    return null
  }
}

export function saveSessionState(routineId: string, dateKey: string, day: DayOfWeek, state: PersistedSessionState): void {
  try {
    localStorage.setItem(storageKey(routineId, dateKey, day), JSON.stringify(state))
  } catch {
    // localStorage no disponible (privado/lleno): la sesión simplemente no persiste.
  }
}

export function clearSessionState(routineId: string, dateKey: string, day: DayOfWeek): void {
  try {
    localStorage.removeItem(storageKey(routineId, dateKey, day))
  } catch {
    // no-op
  }
}
