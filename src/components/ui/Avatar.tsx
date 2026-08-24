interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: number
}

export function Avatar({ src, name, size = 44 }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'

  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-surface-raised text-text-secondary"
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
