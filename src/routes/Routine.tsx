import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { DayTabs } from '@/components/features/routine/DayTabs'
import { RoutineExerciseItem } from '@/components/features/routine/RoutineExerciseItem'
import { RoutineExerciseEditor } from '@/components/features/routine-manager/RoutineExerciseEditor'
import { RoutineList } from '@/components/features/routine-manager/RoutineList'
import { useActiveRoutine } from '@/hooks/useActiveRoutine'
import { useExercises } from '@/hooks/useExercises'
import { useRoutines } from '@/hooks/useRoutines'
import { todayDayOfWeek } from '@/lib/date'
import { exportRoutineToCsv } from '@/lib/exportRoutine'
import { DAYS_OF_WEEK, type DayOfWeek } from '@/types/database'
import Exercises from './Exercises'

type Mode = 'hoy' | 'ejercicios' | 'rutinas'
const MODE_LABELS: Record<Mode, string> = { hoy: 'Hoy', ejercicios: 'Ejercicios', rutinas: 'Rutinas' }

export default function Routine() {
  const [mode, setMode] = useState<Mode>('hoy')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl text-text-primary">Rutina</h1>

      <div className="flex gap-2 rounded-xl bg-surface-raised p-1">
        {(['hoy', 'ejercicios', 'rutinas'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`min-h-11 flex-1 rounded-lg text-sm font-medium ${
              mode === m ? 'bg-accent-primary text-white' : 'text-text-secondary'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {mode === 'hoy' && <TodayView />}
      {mode === 'ejercicios' && <Exercises />}
      {mode === 'rutinas' && <RoutineManager />}
    </div>
  )
}

function TodayView() {
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
    return <p className="text-text-muted">Todavía no tenés una rutina activa. Creá o activá una en la pestaña "Rutinas".</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">{routine.name}</p>

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

function RoutineManager() {
  const { routines, loading, addRoutine, rename, activate, remove } = useRoutines()
  const { exercises } = useExercises()
  const { routine: activeRoutine, items: activeItems } = useActiveRoutine()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedId && routines.length > 0) {
      setSelectedId(routines.find((r) => r.is_active)?.id ?? routines[0].id)
    }
  }, [routines, selectedId])

  const handleDelete = async (id: string) => {
    await remove(id)
    if (selectedId === id) setSelectedId(null)
  }

  if (loading) {
    return <p className="text-text-muted">Cargando…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {activeRoutine && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => exportRoutineToCsv(activeRoutine, activeItems)}
        >
          Descargar rutina actual (CSV)
        </Button>
      )}

      <RoutineList
        routines={routines}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={async (name) => {
          const created = await addRoutine(name)
          setSelectedId(created.id)
        }}
        onRename={rename}
        onActivate={activate}
        onDelete={handleDelete}
      />

      {selectedId && (
        <div>
          <h2 className="mb-3 text-lg text-text-primary">Ejercicios de esta rutina</h2>
          <RoutineExerciseEditor routineId={selectedId} exercises={exercises} />
        </div>
      )}
    </div>
  )
}
