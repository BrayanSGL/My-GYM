import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { QuickStatCard } from '@/components/features/home/QuickStatCard'
import { RecentActivityFeed } from '@/components/features/home/RecentActivityFeed'
import { TodayWorkoutCard } from '@/components/features/home/TodayWorkoutCard'
import { useAuth } from '@/context/AuthProvider'
import { useActiveRoutine } from '@/hooks/useActiveRoutine'
import { useProfile } from '@/hooks/useProfile'
import { countSetsSince, getLastWorkoutDate, listRecentSets } from '@/lib/api/sets'
import { daysSince, formatTime, greetingForHour, startOfIsoWeek } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

function formatDaysSinceWorkout(lastWorkoutDate: string | null): string {
  if (!lastWorkoutDate) return 'Todavía no registraste ningún entrenamiento.'
  const days = daysSince(lastWorkoutDate)
  if (days <= 0) return 'Entrenaste hoy.'
  if (days === 1) return 'Hace 1 día que no entrenás.'
  return `Hace ${days} días que no entrenás.`
}

export default function Home() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { routine, items, loading: routineLoading } = useActiveRoutine()
  const [setsThisWeek, setSetsThisWeek] = useState(0)
  const [recentSets, setRecentSets] = useState<(WorkoutSet & { exercises: { name: string } | null })[]>([])
  const [lastWorkoutDate, setLastWorkoutDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => new Date())

  const username = profile?.username || user?.email?.split('@')[0] || 'atleta'

  useEffect(() => {
    async function load() {
      const weekStart = startOfIsoWeek().toISOString().slice(0, 10)
      const [setsCount, recent, lastDate] = await Promise.all([
        countSetsSince(weekStart),
        listRecentSets(5),
        getLastWorkoutDate(),
      ])
      setSetsThisWeek(setsCount)
      setRecentSets(recent)
      setLastWorkoutDate(lastDate)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-text-primary">
            {greetingForHour(now.getHours())}, {username}
          </h1>
          <p className="text-xs text-text-muted">{formatTime(now)}</p>
          <p className="mt-1 text-text-secondary">{formatDaysSinceWorkout(lastWorkoutDate)}</p>
        </div>
        <Link to="/perfil" aria-label="Ver perfil">
          <Avatar src={profile?.avatar_url} name={username} size={48} />
        </Link>
      </div>

      <TodayWorkoutCard routine={routine} items={items} loading={routineLoading} />

      <QuickStatCard label="Series esta semana" value={setsThisWeek} />

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
