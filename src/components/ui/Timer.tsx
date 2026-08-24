import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface TimerProps {
  seconds: number
  onComplete: () => void
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function Timer({ seconds, onComplete }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      onComplete()
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <span className="font-heading text-6xl text-accent-primary">{formatSeconds(remaining)}</span>
      <p className="text-text-secondary">Descanso</p>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setRemaining((r) => r + 15)}>
          +15 s
        </Button>
        <Button type="button" onClick={() => setRemaining(0)}>
          Saltar descanso
        </Button>
      </div>
    </div>
  )
}
