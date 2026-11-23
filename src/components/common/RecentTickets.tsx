
import StatusBadge from '../ui/StatusBadge'
import PriorityBadge from '../ui/PriorityBadge'
import { Link } from 'react-router-dom'
import type { Ticket } from '../../types/Ticket'
import { useMemo } from 'react'

interface RecentTicketsProps {
    tickets: Ticket[]
}
function RecentTickets({ tickets }: RecentTicketsProps) {
   const recentTickets = useMemo(() => {
    return [...tickets]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
}, [tickets])
    return (
        <div className="recent-tickets">
            <div className="recent-tickets-header">
                <h5>Recent Tickets</h5>
                <Link
                    to="/tickets"
                    className="btn btn-outline-primary btn-sm"
                >
                    View All
                </Link>

            </div>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Subject</th>
                            <th>Customer</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No tickets available.
                                </td>
                            </tr>
                        ) : (recentTickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>
                                    <Link
                                        to={`/tickets/${ticket.id}`}
                                        className="ticket-id-link"
                                    >
                                        #{ticket.id}
                                    </Link>
                                </td>
                                <td>{ticket.subject}</td>
                                <td>{ticket.customer}</td>
                                <td>
                                    <PriorityBadge priority={ticket.priority} />
                                </td>
                                <td>
                                    <StatusBadge status={ticket.status} />
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>)
}
export default RecentTickets
