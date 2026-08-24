import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DayTabs } from '@/components/features/routine/DayTabs'
import { useRoutineExercises } from '@/hooks/useRoutineExercises'
import { DAYS_OF_WEEK, MUSCLE_GROUPS, type DayOfWeek, type Exercise } from '@/types/database'
import { AddRoutineExerciseForm } from './AddRoutineExerciseForm'

interface RoutineExerciseEditorProps {
  routineId: string
  exercises: Exercise[]
}

export function RoutineExerciseEditor({ routineId, exercises }: RoutineExerciseEditorProps) {
  const { items, loading, addItem, removeItem, setActive } = useRoutineExercises(routineId)
  const [day, setDay] = useState<DayOfWeek>('lunes')
  const [showForm, setShowForm] = useState(false)

  const dayItems = useMemo(
    () => items.filter((i) => i.day_of_week === day).sort((a, b) => a.order_index - b.order_index),
    [items, day],
  )
  const allDays = DAYS_OF_WEEK.map((d) => d.value)

  return (
    <div className="flex flex-col gap-3">
      <DayTabs availableDays={allDays} value={day} onChange={setDay} />

      {loading ? (
        <p className="text-text-muted">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {dayItems.map((item) => {
              const groupLabel = item.exercises
                ? MUSCLE_GROUPS.find((g) => g.value === item.exercises!.muscle_group)?.label
                : null
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className={`flex flex-col gap-2 ${item.active ? '' : 'opacity-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-text-muted">{item.order_index}.</span>
                        <span className="text-lg font-medium text-text-primary">{item.exercises?.name ?? 'Ejercicio'}</span>
                      </div>
                      {groupLabel && <Badge>{groupLabel}</Badge>}
                    </div>
                    <p className="text-sm text-accent-secondary">{item.scheme_text}</p>
                    {item.rest_text && <p className="text-sm text-text-muted">{item.rest_text}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => setActive(item.id, !item.active)}>
                        {item.active ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button type="button" variant="danger" onClick={() => removeItem(item.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {dayItems.length === 0 && !showForm && (
            <p className="text-sm text-text-muted">Todavía no hay ejercicios este día.</p>
          )}

          <AnimatePresence>
            {showForm && (
              <AddRoutineExerciseForm
                exercises={exercises}
                routineId={routineId}
                day={day}
                nextOrderIndex={dayItems.length + 1}
                onSubmit={async (input) => {
                  await addItem(input)
                  setShowForm(false)
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>

          {!showForm && (
            <Button type="button" variant="secondary" onClick={() => setShowForm(true)}>
              + Agregar ejercicio a este día
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
