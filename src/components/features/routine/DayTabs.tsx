import { motion } from 'framer-motion'
import { DAYS_OF_WEEK, type DayOfWeek } from '@/types/database'

interface DayTabsProps {
  availableDays: DayOfWeek[]
  value: DayOfWeek
  onChange: (day: DayOfWeek) => void
}

export function DayTabs({ availableDays, value, onChange }: DayTabsProps) {
  const days = DAYS_OF_WEEK.filter((d) => availableDays.includes(d.value))

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((day) => {
        const isActive = day.value === value
        return (
          <motion.button
            key={day.value}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(day.value)}
            className={`min-h-11 flex-shrink-0 rounded-full px-4 text-sm font-medium ${
              isActive ? 'bg-accent-primary text-white' : 'bg-surface-raised text-text-secondary'
            }`}
          >
            {day.label}
          </motion.button>
        )
      })}
    </div>
  )
}
