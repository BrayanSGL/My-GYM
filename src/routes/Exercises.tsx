import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ExerciseForm } from '@/components/features/exercises/ExerciseForm'
import { ExerciseListItem } from '@/components/features/exercises/ExerciseListItem'
import { useExercises } from '@/hooks/useExercises'

export default function Exercises() {
  const { exercises, loading, addExercise, removeExercise } = useExercises()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-text-primary">Ejercicios</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : '+ Nuevo'}</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <ExerciseForm
            onSubmit={async (name, group) => {
              await addExercise(name, group)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-text-muted">Cargando…</p>
      ) : exercises.length === 0 ? (
        <p className="text-text-muted">Todavía no agregaste ejercicios.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {exercises.map((exercise) => (
              <ExerciseListItem key={exercise.id} exercise={exercise} onDelete={removeExercise} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
