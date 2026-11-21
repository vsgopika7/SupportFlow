
import type { LucideIcon} from 'lucide-react'

type StatCardProps = {
  title: string
  value: number
  icon: LucideIcon
  color: string
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <p>{title}</p>
        <div
          className="stat-icon"
          style={{ backgroundColor: color }}
        >
          <Icon size={22} color="white" />
        </div>
      </div>
      <h2>{value}</h2>
    </div>
  )
}

export default StatCard
