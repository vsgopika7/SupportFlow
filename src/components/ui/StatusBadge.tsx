type TicketStatus=
   |"Open"
  |"Assigned"|"In Progress"|"Waiting for Customer"|"Resolved"|"Closed"

interface StatusBadgeProps{
    status:TicketStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass: Record<TicketStatus, string> = {
    Open: 'status-open',
    Assigned: 'status-assigned',
    'In Progress': 'status-progress',
    'Waiting for Customer': 'status-waiting',
    Resolved: 'status-resolved',
    Closed: 'status-closed'
  }
  return (
    <span className={`status-badge ${statusClass[status]}`}>
      {status}
    </span>
  )
}

export default StatusBadge