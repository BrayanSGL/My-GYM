import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
  secondary:
    'bg-[var(--button-secondary-bg)] text-text-primary border border-[var(--button-secondary-border)]',
  danger: 'bg-[var(--button-danger-bg)] text-white',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-base font-medium disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
