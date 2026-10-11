import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { DayTabs } from '@/components/features/routine/DayTabs'
import { todayDayOfWeek } from '@/lib/date'
import { daysUntilReview, formatReviewCountdown } from '@/lib/routineCycle'
import { DAYS_OF_WEEK, type DayOfWeek } from '@/types/database'
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
  const activeItems = items.filter((i) => i.active)
  const availableDays = DAYS_OF_WEEK.map((d) => d.value).filter((day) => activeItems.some((i) => i.day_of_week === day))
  const [pickedDay, setPickedDay] = useState<DayOfWeek | null>(null)
  const selectedDay = pickedDay && availableDays.includes(pickedDay) ? pickedDay : availableDays.includes(today) ? today : availableDays[0]
  const selectedCount = activeItems.filter((i) => i.day_of_week === selectedDay).length
  const todayHasItems = availableDays.includes(today)

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">Hoy es {todayLabel}</p>

      {loading ? (
        <p className="text-text-muted">Cargando…</p>
      ) : !routine ? (
        <p className="text-text-muted">Todavía no tenés una rutina activa.</p>
      ) : availableDays.length === 0 ? (
        <p className="text-text-muted">Tu rutina todavía no tiene ejercicios programados.</p>
      ) : (
        <>
          <p className="font-heading text-2xl text-text-primary">{routine.name}</p>
          {!todayHasItems && <p className="text-sm text-text-muted">Hoy no tenés ejercicios programados — podés entrenar otro día.</p>}
          <DayTabs availableDays={availableDays} value={selectedDay} onChange={setPickedDay} recommendedDay={today} />
          <p className="text-sm text-text-muted">{selectedCount} ejercicios</p>
          {routine.cycle_started_at && (
            <p className="text-xs text-accent-secondary">{formatReviewCountdown(daysUntilReview(routine.cycle_started_at))}</p>
          )}
          <Link
            to={`/sesion?dia=${selectedDay}`}
            className="flex min-h-11 items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-4 py-2.5 text-base font-medium text-[var(--button-primary-text)]"
          >
            Iniciar entrenamiento
          </Link>
        </>
      )}
    </Card>
  )
}
