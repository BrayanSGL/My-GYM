import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { todayDayOfWeek } from '@/lib/date'
import { daysUntilReview, formatReviewCountdown } from '@/lib/routineCycle'
import { DAYS_OF_WEEK } from '@/types/database'
import type { RoutineExerciseWithExercise } from '@/lib/api/routines'
import type { Routine } from '@/types/database'

interface TodayWorkoutCardProps {
  routine: Routine | null
  items: RoutineExerciseWithExercise[]
  loading: boolean
}

export function TodayWorkoutCard({ routine, items, loading }: TodayWorkoutCardProps) {
  const today = todayDayOfWeek()
  const todayLabel = DAYS_OF_WEEK.find((d) => d.value === today)?.label ?? ''
  const todayItems = items.filter((i) => i.day_of_week === today && i.active)

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">Hoy es {todayLabel}</p>

      {loading ? (
        <p className="text-text-muted">Cargando…</p>
      ) : !routine ? (
        <p className="text-text-muted">Todavía no tenés una rutina activa.</p>
      ) : todayItems.length === 0 ? (
        <p className="text-text-muted">Día de descanso — no hay ejercicios programados.</p>
      ) : (
        <>
          <p className="font-heading text-2xl text-text-primary">{routine.name}</p>
          <p className="text-sm text-text-muted">{todayItems.length} ejercicios</p>
          {routine.cycle_started_at && (
            <p className="text-xs text-accent-secondary">{formatReviewCountdown(daysUntilReview(routine.cycle_started_at))}</p>
          )}
          <Link
            to="/sesion"
            className="flex min-h-11 items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-4 py-2.5 text-base font-medium text-[var(--button-primary-text)]"
          >
            Iniciar entrenamiento
          </Link>
        </>
      )}
    </Card>
  )
}
