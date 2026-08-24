import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SetForm } from '@/components/features/sets/SetForm'
import { SetHistoryList } from '@/components/features/sets/SetHistoryList'
import { useAuth } from '@/context/AuthProvider'
import { getExercise, uploadExerciseGif } from '@/lib/api/exercises'
import { useSets } from '@/hooks/useSets'
import type { Exercise } from '@/types/database'

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const { sets, addSet, removeSet } = useSets(id)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [gifError, setGifError] = useState<string | null>(null)

  useEffect(() => {
    if (id) getExercise(id).then(setExercise)
  }, [id])

  const personalRecord = useMemo(() => {
    if (sets.length === 0) return null
    return [...sets].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      if (b.reps !== a.reps) return b.reps - a.reps
      return b.set_date.localeCompare(a.set_date)
    })[0]
  }, [sets])

  const handleGifChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id || !user) return
    setGifError(null)
    setUploading(true)
    try {
      const gifUrl = await uploadExerciseGif(user.id, id, file)
      setExercise((prev) => (prev ? { ...prev, gif_url: gifUrl } : prev))
    } catch (err) {
      setGifError(err instanceof Error ? err.message : 'No se pudo subir el GIF.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (!id) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/ejercicios" className="text-sm text-text-secondary">
          ← Ejercicios
        </Link>
        <h1 className="font-heading text-3xl text-text-primary">{exercise?.name ?? 'Ejercicio'}</h1>
      </div>

      {personalRecord && (
        <Card className="border-accent-primary/40 bg-surface-raised">
          <p className="text-sm text-text-secondary">Récord personal</p>
          <p className="font-heading text-2xl text-accent-primary">
            {personalRecord.weight} kg × {personalRecord.reps}
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {exercise?.gif_url && (
          <img src={exercise.gif_url} alt={`Demostración de ${exercise.name}`} className="w-full rounded-2xl border border-border" />
        )}
        <input ref={fileInputRef} type="file" accept="image/gif,image/*" onChange={handleGifChange} className="hidden" />
        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Subiendo…' : exercise?.gif_url ? 'Cambiar GIF' : 'Subir GIF de demostración'}
        </Button>
        {gifError && <p className="text-sm text-danger">{gifError}</p>}
      </div>

      <div>
        <h2 className="mb-3 text-lg text-text-primary">Registrar serie</h2>
        <SetForm exerciseId={id} onSubmit={addSet} />
      </div>

      <div>
        <h2 className="mb-3 text-lg text-text-primary">Historial</h2>
        <SetHistoryList sets={sets} onDelete={removeSet} />
      </div>
    </div>
  )
}
