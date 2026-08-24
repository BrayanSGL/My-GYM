import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/rutina', label: 'Rutina' },
  { to: '/progreso', label: 'Progreso' },
  { to: '/notas', label: 'Notas' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[480px] border-t border-[var(--nav-border)] bg-[var(--nav-bg)] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-between px-2 py-1">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-xs ${
                  isActive ? 'text-accent-primary' : 'text-text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <motion.span whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-accent-primary' : 'bg-transparent'}`} />
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
