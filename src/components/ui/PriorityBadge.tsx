type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

interface PriorityBadgeProps {
    priority: TicketPriority
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
    const priorityClass: Record<TicketPriority, string> = {
        Low: 'priority-low',
        Medium: 'priority-medium',
        High: 'priority-high',
        Critical: 'priority-critical'
    }
    return (
        <span className={`priority-badge ${priorityClass[priority]}`}>
            {priority}
        </span>
    )
}

export default PriorityBadge