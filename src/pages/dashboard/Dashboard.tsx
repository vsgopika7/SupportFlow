
import {
  Ticket as TicketIcon,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import RecentTickets from '../../components/common/RecentTickets'
import './Dashboard.css'
import useLocalStorage from '../../hooks/useLocalStorage'
import type { Ticket } from '../../types/Ticket'
import { initialTickets } from '../../data/tickets'
import { useAuth } from '../../context/useAuth'
import type { Agent } from '../../types/Agent'
import { initialAgents } from '../../data/agents'

function Dashboard() {
  const [tickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )

  const [agents] = useLocalStorage<Agent[]>(
    'supportflow-agents',
    initialAgents
  )

  const { user } = useAuth()

  // Find logged-in agent profile
  const loggedInAgent = agents.find(
    agent =>
      user?.email &&
      agent.email.toLowerCase() === user.email.toLowerCase()
  )

  // Filter tickets based on role
  const visibleTickets = tickets.filter(ticket => {
    if (!user) return false

    if (user.role === 'Admin') {
      return true
    }

    if (user.role === 'Agent') {
      const agentName = loggedInAgent?.name || user.name
      return ticket.assignedAgent === agentName
    }

    if (user.role === 'Customer') {
      return ticket.customer === user.name
    }

    return false
  })

  // Calculate stats from role-filtered tickets
  const totalTickets = visibleTickets.length

  const openTickets = visibleTickets.filter(
    ticket => ticket.status === 'Open'
  ).length

  const inProgressTickets = visibleTickets.filter(
    ticket => ticket.status === 'In Progress'
  ).length

  const resolvedTickets = visibleTickets.filter(
    ticket => ticket.status === 'Resolved'
  ).length

  const highPriorityTickets = visibleTickets.filter(
    ticket => ticket.priority === 'High'
  ).length

  const assignedTickets = visibleTickets.filter(
    ticket => ticket.status === 'Assigned'
  ).length

  const waitingTickets = visibleTickets.filter(
    ticket => ticket.status === 'Waiting for Customer'
  ).length

  const closedTickets = visibleTickets.filter(
    ticket => ticket.status === 'Closed'
  ).length

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        description="Monitor ticket performance and support operations."
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary dashboard-refresh-btn"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          icon={TicketIcon}
          color="#2563eb"
        />

        <StatCard
          title="Open Tickets"
          value={openTickets}
          icon={FolderOpen}
          color="#d97706"
        />

        <StatCard
          title="In Progress"
          value={inProgressTickets}
          icon={Clock}
          color="#7c3aed"
        />

        <StatCard
          title="Resolved"
          value={resolvedTickets}
          icon={CheckCircle}
          color="#16a34a"
        />

        <StatCard
          title="High Priority"
          value={highPriorityTickets}
          icon={AlertTriangle}
          color="#dc2626"
        />
      </div>

      {/* Ticket status summary */}
      <div className="mt-4 d-flex flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="Open" />
          <span className="fw-semibold">{openTickets}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="Assigned" />
          <span className="fw-semibold">{assignedTickets}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="In Progress" />
          <span className="fw-semibold">{inProgressTickets}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="Waiting for Customer" />
          <span className="fw-semibold">{waitingTickets}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="Resolved" />
          <span className="fw-semibold">{resolvedTickets}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status="Closed" />
          <span className="fw-semibold">{closedTickets}</span>
        </div>
      </div>

      {/* Recent Tickets */}
      <RecentTickets tickets={visibleTickets} />
    </div>
  )
}

export default Dashboard
