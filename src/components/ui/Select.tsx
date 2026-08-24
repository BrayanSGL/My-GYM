import { useId, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, id, className = '', ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm text-text-secondary">
        {label}
      </label>
      <select
        id={selectId}
        className={`min-h-11 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 text-base text-text-primary outline-none focus:border-accent-primary ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
