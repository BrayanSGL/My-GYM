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

function storageKey(routineId: string, dayKey: string): string {
  return `mi-gym-session:${routineId}:${dayKey}`
}

export function loadSessionState(routineId: string, dayKey: string): PersistedSessionState | null {
  try {
    const raw = localStorage.getItem(storageKey(routineId, dayKey))
    return raw ? (JSON.parse(raw) as PersistedSessionState) : null
  } catch {
    return null
  }
}

export function saveSessionState(routineId: string, dayKey: string, state: PersistedSessionState): void {
  try {
    localStorage.setItem(storageKey(routineId, dayKey), JSON.stringify(state))
  } catch {
    // localStorage no disponible (privado/lleno): la sesión simplemente no persiste.
  }
}

export function clearSessionState(routineId: string, dayKey: string): void {
  try {
    localStorage.removeItem(storageKey(routineId, dayKey))
  } catch {
    // no-op
  }
}
