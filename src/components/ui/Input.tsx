import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm text-text-secondary">
        {label}
      </label>
      <input
        id={inputId}
        className={`min-h-11 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 text-base text-text-primary outline-none focus:border-accent-primary ${className}`}
        {...props}
      />
    </div>
  )
}
