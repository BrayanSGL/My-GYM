import { Card } from '@/components/ui/Card'

interface QuickStatCardProps {
  label: string
  value: number
}

export function QuickStatCard({ label, value }: QuickStatCardProps) {
  return (
    <Card className="flex flex-1 flex-col gap-1">
      <span className="font-heading text-3xl text-accent-primary">{value}</span>
      <span className="text-sm text-text-secondary">{label}</span>
    </Card>
  )
}
