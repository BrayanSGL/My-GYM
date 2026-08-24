import { AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { DayTabs } from '@/components/features/routine/DayTabs'
import { RoutineExerciseItem } from '@/components/features/routine/RoutineExerciseItem'
import { useActiveRoutine } from '@/hooks/useActiveRoutine'
import { todayDayOfWeek } from '@/lib/date'
import { DAYS_OF_WEEK, type DayOfWeek } from '@/types/database'

export default function Routine() {
  const { routine, items, loading } = useActiveRoutine()
  const today = todayDayOfWeek()

  const availableDays = useMemo(() => {
    const present = new Set(items.map((i) => i.day_of_week))
    return DAYS_OF_WEEK.map((d) => d.value).filter((d) => present.has(d))
  }, [items])

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null)
  const activeDay = selectedDay ?? (availableDays.includes(today) ? today : availableDays[0])

  const dayItems = useMemo(
    () =>
      items
        .filter((i) => i.day_of_week === activeDay && i.active)
        .sort((a, b) => a.order_index - b.order_index),
    [items, activeDay],
  )

  if (loading) {
    return <p className="text-text-muted">Cargando…</p>
  }

  if (!routine) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl text-text-primary">Rutina</h1>
        <p className="text-text-muted">Todavía no tenés una rutina activa.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-3xl text-text-primary">Rutina</h1>
        <p className="text-text-secondary">{routine.name}</p>
      </div>

      <DayTabs availableDays={availableDays} value={activeDay} onChange={setSelectedDay} />

      <div className="flex flex-col gap-3">
        {dayItems.length === 0 ? (
          <p className="text-text-muted">No hay ejercicios activos para este día.</p>
        ) : (
          <AnimatePresence initial={false}>
            {dayItems.map((item) => (
              <RoutineExerciseItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
