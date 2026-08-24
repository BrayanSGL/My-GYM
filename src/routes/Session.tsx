import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Timer } from '@/components/ui/Timer'
import { SetForm } from '@/components/features/sets/SetForm'
import { useActiveRoutine } from '@/hooks/useActiveRoutine'
import { createSet, type NewSetInput } from '@/lib/api/sets'
import { todayDayOfWeek } from '@/lib/date'
import { clearSessionState, loadSessionState, saveSessionState, type SessionPhase, type SessionSetValues } from '@/lib/sessionState'
import { MUSCLE_GROUPS } from '@/types/database'

const DEFAULT_REST_SECONDS = 60
const todayKey = new Date().toISOString().slice(0, 10)

function parseSetsCount(schemeText: string): number {
  const match = schemeText.match(/(\d+)/)
  return match ? Number(match[1]) : 3
}

export default function Session() {
  const { routine, items, loading } = useActiveRoutine()
  const today = todayDayOfWeek()
  const todayItems = items.filter((i) => i.day_of_week === today && i.active).sort((a, b) => a.order_index - b.order_index)

  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(1)
  const [phase, setPhase] = useState<SessionPhase>('exercising')
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null)
  const [lastValues, setLastValues] = useState<SessionSetValues | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Al entrar, recupera el progreso guardado de hoy (si recargaste la página a mitad de la sesión).
  useEffect(() => {
    if (!routine) return
    const saved = loadSessionState(routine.id, todayKey)
    if (saved) {
      setExerciseIndex(saved.exerciseIndex)
      setSetIndex(saved.setIndex)
      setPhase(saved.phase)
      setRestEndsAt(saved.restEndsAt)
      setLastValues(saved.lastValues)
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine?.id])

  // Guarda el progreso en cada cambio, para poder recuperarlo si recargás por error.
  useEffect(() => {
    if (!hydrated || !routine) return
    saveSessionState(routine.id, todayKey, { exerciseIndex, setIndex, phase, restEndsAt, lastValues })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, routine?.id, exerciseIndex, setIndex, phase, restEndsAt, lastValues])

  if (loading || !hydrated) {
    return <p className="text-text-muted">Cargando…</p>
  }

  if (!routine || todayItems.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl text-text-primary">Sesión</h1>
        <p className="text-text-muted">No hay entrenamiento programado para hoy.</p>
        <Link to="/" className="text-sm text-accent-primary underline-offset-2 hover:underline">
          ← Volver a Inicio
        </Link>
      </div>
    )
  }

  const current = todayItems[Math.min(exerciseIndex, todayItems.length - 1)]
  const exercise = current.exercises
  const totalSets = parseSetsCount(current.scheme_text)
  const isLastSetOfExercise = setIndex >= totalSets
  const isLastExercise = exerciseIndex >= todayItems.length - 1
  const groupLabel = exercise ? MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label : null
  const restRemainingSeconds = restEndsAt != null ? Math.max(0, Math.round((restEndsAt - Date.now()) / 1000)) : 0

  const exitSession = () => clearSessionState(routine.id, todayKey)

  const advance = () => {
    if (!isLastSetOfExercise) {
      setSetIndex((i) => i + 1)
      setRestEndsAt(null)
      setPhase('exercising')
      return
    }
    if (!isLastExercise) {
      setExerciseIndex((i) => i + 1)
      setSetIndex(1)
      setRestEndsAt(null)
      setLastValues(null)
      setPhase('exercising')
      return
    }
    clearSessionState(routine.id, todayKey)
    setPhase('finished')
  }

  const handleSetLogged = async (input: NewSetInput) => {
    await createSet(input)
    setLastValues({
      weight: String(input.weight),
      reps: String(input.reps),
      rpe: input.rpe != null ? String(input.rpe) : '',
      note: input.note ?? '',
    })
    const restSeconds = current.rest_seconds ?? DEFAULT_REST_SECONDS
    setRestEndsAt(Date.now() + restSeconds * 1000)
    setPhase('resting')
  }

  if (phase === 'finished') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <h1 className="font-heading text-3xl text-text-primary">¡Entrenamiento completo!</h1>
        <p className="text-text-secondary">Terminaste los {todayItems.length} ejercicios de hoy.</p>
        <Link
          to="/"
          className="flex min-h-11 items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-6 py-2.5 text-base font-medium text-[var(--button-primary-text)]"
        >
          Volver a Inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link to="/" onClick={exitSession} className="text-sm text-text-secondary">
          ✕ Salir
        </Link>
        <p className="text-sm text-text-muted">
          Ejercicio {exerciseIndex + 1} de {todayItems.length} · Serie {setIndex} de {totalSets}
        </p>
      </div>

      <motion.div
        key={`${exerciseIndex}-${setIndex}-${phase}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="flex flex-col gap-4"
      >
        {phase === 'resting' ? (
          <Card>
            <Timer seconds={restRemainingSeconds} onComplete={advance} />
          </Card>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-heading text-3xl text-text-primary">{exercise?.name ?? 'Ejercicio'}</h1>
              {groupLabel && <Badge>{groupLabel}</Badge>}
            </div>

            {exercise?.gif_url && (
              <img src={exercise.gif_url} alt={`Demostración de ${exercise.name}`} className="w-full rounded-2xl border border-border" />
            )}

            <Card className="flex flex-col gap-2">
              <p className="text-accent-secondary">{current.scheme_text}</p>
              {current.technique_notes && <p className="text-sm text-text-secondary">{current.technique_notes}</p>}
            </Card>

            {exercise && (
              <SetForm exerciseId={exercise.id} onSubmit={handleSetLogged} initialValues={lastValues ?? undefined} />
            )}

            <Button type="button" variant="secondary" onClick={advance}>
              Saltar serie
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
