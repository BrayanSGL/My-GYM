import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { QuickStatCard } from '@/components/features/home/QuickStatCard'
import { RecentActivityFeed } from '@/components/features/home/RecentActivityFeed'
import { useAuth } from '@/context/AuthProvider'
import { useProfile } from '@/hooks/useProfile'
import { listExercises } from '@/lib/api/exercises'
import { countSetsSince, listRecentSets } from '@/lib/api/sets'
import { startOfIsoWeek } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

export default function Home() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [exerciseCount, setExerciseCount] = useState(0)
  const [setsThisWeek, setSetsThisWeek] = useState(0)
  const [recentSets, setRecentSets] = useState<(WorkoutSet & { exercises: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)

  const name = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'atleta'

  useEffect(() => {
    async function load() {
      const weekStart = startOfIsoWeek().toISOString().slice(0, 10)
      const [exercises, setsCount, recent] = await Promise.all([
        listExercises(),
        countSetsSince(weekStart),
        listRecentSets(5),
      ])
      setExerciseCount(exercises.length)
      setSetsThisWeek(setsCount)
      setRecentSets(recent)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl capitalize text-text-primary">Hola, {name}</h1>
          <p className="text-text-secondary">Así va tu semana.</p>
        </div>
        <Link to="/perfil" aria-label="Ver perfil">
          <Avatar src={profile?.avatar_url} name={name} size={48} />
        </Link>
      </div>

      <div className="flex gap-3">
        <QuickStatCard label="Ejercicios" value={exerciseCount} />
        <QuickStatCard label="Series esta semana" value={setsThisWeek} />
      </div>

      <div className="flex gap-3">
        <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
          <Link
            to="/ejercicios"
            className="flex min-h-11 items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-4 py-2.5 text-base font-medium text-[var(--button-primary-text)]"
          >
            Registrar serie
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
          <Link
            to="/notas"
            className="flex min-h-11 items-center justify-center rounded-xl border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] px-4 py-2.5 text-base font-medium text-text-primary"
          >
            Agregar nota
          </Link>
        </motion.div>
      </div>

      <div>
        <h2 className="mb-3 text-lg text-text-primary">Actividad reciente</h2>
        {!loading && <RecentActivityFeed sets={recentSets} />}
      </div>
    </div>
  )
}
