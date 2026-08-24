import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { Routine } from '@/types/database'

interface RoutineListProps {
  routines: Routine[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => Promise<void>
  onRename: (id: string, name: string) => Promise<void>
  onActivate: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function RoutineRow({
  routine,
  selected,
  onSelect,
  onRename,
  onActivate,
  onDelete,
}: {
  routine: Routine
  selected: boolean
  onSelect: () => void
  onRename: (name: string) => Promise<void>
  onActivate: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(routine.name)

  const handleRenameSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await onRename(name.trim())
    setEditing(false)
  }

  return (
    <Card className={`flex flex-col gap-2 ${selected ? 'border-accent-primary' : ''}`}>
      {editing ? (
        <form onSubmit={handleRenameSubmit} className="flex flex-col gap-2">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Guardar
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <>
          <button type="button" onClick={onSelect} className="flex items-center justify-between gap-3 text-left">
            <span className="text-lg font-medium text-text-primary">{routine.name}</span>
            {routine.is_active && <Badge>Activa</Badge>}
          </button>
          <div className="flex flex-wrap gap-2">
            {!routine.is_active && (
              <Button type="button" variant="secondary" onClick={onActivate}>
                Activar
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
              Renombrar
            </Button>
            <Button type="button" variant="danger" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

export function RoutineList({ routines, selectedId, onSelect, onCreate, onRename, onActivate, onDelete }: RoutineListProps) {
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await onCreate(newName.trim())
      setNewName('')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {routines.length === 0 && <p className="text-sm text-text-muted">Todavía no creaste ninguna rutina.</p>}

      {routines.map((routine) => (
        <motion.div key={routine.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RoutineRow
            routine={routine}
            selected={routine.id === selectedId}
            onSelect={() => onSelect(routine.id)}
            onRename={(name) => onRename(routine.id, name)}
            onActivate={() => onActivate(routine.id)}
            onDelete={() => onDelete(routine.id)}
          />
        </motion.div>
      ))}

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input label="Nueva rutina" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Fuerza" />
        <Button type="submit" disabled={creating} className="self-end">
          Crear
        </Button>
      </form>
    </div>
  )
}
