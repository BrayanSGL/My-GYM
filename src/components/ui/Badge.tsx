import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs text-text-secondary">
      {children}
    </span>
  )
}
