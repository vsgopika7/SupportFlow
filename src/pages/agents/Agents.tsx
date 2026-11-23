import PageHeader from '../../components/common/PageHeader'
import { initialAgents } from '../../data/agents'
import type { Agent } from '../../types/Agent'
import { initialTickets } from '../../data/tickets'
import type { Ticket } from '../../types/Ticket'
import useLocalStorage from '../../hooks/useLocalStorage'
import type { Notification } from '../../types/Notification'
import { addNotification } from '../../utils/notificationStorage'
import { useState, useMemo } from 'react'
import {
  validateAgentForm,
  type AgentFormErrors,
  type AgentFormData,
} from '../../utils/agentValidation'
import './Agents.css'
import toast from 'react-hot-toast'
const emptyForm: AgentFormData = {
  name: '',
  email: '',
  role: '',
  department: '',
}

function Agents() {
  const [agents, setAgents] = useLocalStorage<Agent[]>(
    'supportflow-agents',
    initialAgents
  )

  const [tickets, setTickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)

  const [formData, setFormData] = useState<AgentFormData>(emptyForm)

  const [formErrors, setFormErrors] = useState<AgentFormErrors>({
    name: '',
    email: '',
    role: '',
    department: '',
  })

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState('')

  // Calculate assigned ticket count directly from tickets
  // Calculate ticket counts for all agents in one pass
  const assignedTicketCounts = useMemo(() => {
    return tickets.reduce((counts, ticket) => {
      if (
        ticket.assignedAgent &&
        ticket.assignedAgent !== 'Unassigned'
      ) {
        counts.set(
          ticket.assignedAgent,
          (counts.get(ticket.assignedAgent) || 0) + 1
        )
      }
      return counts
    }, new Map<string, number>())
  }, [tickets])
  const getAssignedCount = (agentName: string) =>
    assignedTicketCounts.get(agentName) || 0

  // Summary calculations
  const agentStats = useMemo(() => {
    return agents.reduce(
      (stats, agent) => {
        stats.total++
        if (agent.status === 'Active') {
          stats.active++
        } else if (agent.status === 'Inactive') {
          stats.inactive++
        }
        return stats
      },
      { total: 0, active: 0, inactive: 0 }
    )
  }, [agents])
  const {
    total: totalAgents,
    active: activeAgents,
    inactive: inactiveAgents,
  } = agentStats

  const totalAssignedTickets = tickets.filter(
    (ticket) =>
      ticket.assignedAgent &&
      ticket.assignedAgent !== 'Unassigned'
  ).length

  // Search and status filtering
 const filteredAgents = useMemo(() => {
  const search = searchTerm.toLowerCase()

  return agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search) ||
      agent.email.toLowerCase().includes(search) ||
      agent.department.toLowerCase().includes(search) ||
      agent.role.toLowerCase().includes(search)
      
    const matchesStatus =
      statusFilter === 'All' || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })
}, [agents, searchTerm, statusFilter])

  // Workload label
  const getWorkloadLabel = (count: number) => {
    if (count === 0) return 'No tickets'
    if (count <= 3) return 'Low'
    if (count <= 5) return 'Medium'
    return 'High'
  }

  const getWorkloadClass = (count: number) => {
    if (count === 0) return 'workload-none'
    if (count <= 3) return 'workload-low'
    if (count <= 5) return 'workload-medium'
    return 'workload-high'
  }

  // Reset form
  const resetForm = () => {
    setFormData(emptyForm)
    setFormErrors({
      name: '',
      email: '',
      role: '',
      department: '',
    })
  }

  // Open Add modal
  const handleAddAgent = () => {
    setEditingAgent(null)
    resetForm()
    setShowModal(true)
  }

  // Open Edit modal
  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)

    setFormData({
      name: agent.name,
      email: agent.email,
      role: agent.role,
      department: agent.department,
    })

    setFormErrors({
      name: '',
      email: '',
      role: '',
      department: '',
    })

    setShowModal(true)
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  // Add or edit agent
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors = validateAgentForm(
      formData,
      agents,
      editingAgent?.id
    )

    setFormErrors(errors)

    if (Object.values(errors).some((error) => error !== '')) {
      return
    }

    if (editingAgent) {
      // Update an existing agent
      const oldName = editingAgent.name
      const newName = formData.name.trim()

      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === editingAgent.id
            ? {
              ...agent,
              name: newName,
              email: formData.email.trim(),
              role: formData.role.trim(),
              department: formData.department.trim(),
            }
            : agent
        )

      )

      // If the agent's name changes, update their tickets too
      if (oldName !== newName) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.assignedAgent === oldName
              ? { ...ticket, assignedAgent: newName }
              : ticket
          )
        )
      }
    } else {
      // Create new agent
      const newAgent: Agent = {
        id:
          agents.length > 0
            ? Math.max(...agents.map((agent) => agent.id)) + 1
            : 1,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        status: 'Active',
        assignedTickets: 0,
      }

      setAgents((prev) => [...prev, newAgent])
    }

    setShowModal(false)
    setEditingAgent(null)
    resetForm()
  }

  // Activate or deactivate agent
  const handleToggleStatus = (agentId: number) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
            ...agent,
            status: agent.status === 'Active' ? 'Inactive' : 'Active',
          }
          : agent
      )
    )
  }

  // Delete agent
  const handleDeleteAgent = (agent: Agent) => {
    const assignedCount = getAssignedCount(agent.name)

    if (assignedCount > 0) {
      window.alert(
        `Cannot delete ${agent.name} because ${assignedCount} ticket(s) are assigned to them. Reassign the tickets first.`
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${agent.name}?`
    )

    if (!confirmed) return

    setAgents((prev) => prev.filter((item) => item.id !== agent.id))
  }

  // Open assignment modal
  const handleOpenAssignModal = () => {
    setSelectedTicketId('')
    setSelectedAgentId('')
    setShowAssignModal(true)
  }

  // Assign/reassign ticket
  const handleAssignTicket = () => {
    if (!selectedTicketId || !selectedAgentId) {
      toast.error('Please select a ticket and an agent')
      return
    }

    const selectedAgent = agents.find(
      (agent) => agent.id === Number(selectedAgentId)
    )

    if (!selectedAgent) {
      toast.error('Agent not found')
      return
    }

    const ticketId = Number(selectedTicketId)

    const assignedTicket = tickets.find(
      (ticket) => ticket.id === ticketId
    )

    if (!assignedTicket) {
      toast.error('Ticket not found')
      return
    }

    // Update ticket assignment
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
            ...ticket,
            assignedAgent: selectedAgent.name,
            status: 'Assigned',
          }
          : ticket
      )
    )

    // Notify the assigned Agent
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Ticket Assigned to You',
      message: `Ticket #${assignedTicket.id} — ${assignedTicket.subject} has been assigned to you.`,
      ticketId: assignedTicket.id,
      type: 'assigned',
      createdAt: new Date().toISOString(),
      read: false,
      recipientRole: 'Agent',
      recipientAgent: selectedAgent.name,
    }

    addNotification(notification)

    toast.success(`Ticket assigned to ${selectedAgent.name}`)

    setSelectedTicketId('')
    setSelectedAgentId('')
  }

  return (
    <div className="agents-page">
      <PageHeader
        title="Agents"
        description="View your support team and monitor agent workloads."
      />

      {/* Summary cards */}
      <div className="row g-3 mb-4 agents-summary">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card agent-stat-card h-100">
            <div className="card-body">
              <div className="agent-stat-top">
                <span className="agent-stat-label">Total Agents</span>
                <span className="agent-stat-icon agent-icon-blue">
                  <i className="bi bi-people"></i>
                </span>
              </div>
              <h3 className="agent-stat-value">{totalAgents}</h3>
              <p className="agent-stat-note">Registered support team</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card agent-stat-card h-100">
            <div className="card-body">
              <div className="agent-stat-top">
                <span className="agent-stat-label">Active Agents</span>
                <span className="agent-stat-icon agent-icon-green">
                  <i className="bi bi-person-check"></i>
                </span>
              </div>
              <h3 className="agent-stat-value">{activeAgents}</h3>
              <p className="agent-stat-note">Currently active</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card agent-stat-card h-100">
            <div className="card-body">
              <div className="agent-stat-top">
                <span className="agent-stat-label">Inactive Agents</span>
                <span className="agent-stat-icon agent-icon-orange">
                  <i className="bi bi-person-dash"></i>
                </span>
              </div>
              <h3 className="agent-stat-value">{inactiveAgents}</h3>
              <p className="agent-stat-note">Currently inactive</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card agent-stat-card h-100">
            <div className="card-body">
              <div className="agent-stat-top">
                <span className="agent-stat-label">Assigned Tickets</span>
                <span className="agent-stat-icon agent-icon-purple">
                  <i className="bi bi-ticket-perforated"></i>
                </span>
              </div>
              <h3 className="agent-stat-value">{totalAssignedTickets}</h3>
              <p className="agent-stat-note">Across all agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Management */}
      <div className="card agent-management-card">
        <div className="agent-management-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="mb-1">Agent Management</h5>
              <p className="text-muted mb-0">
                Manage and monitor your support team
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={handleOpenAssignModal}
              >
                <i className="bi bi-ticket-perforated me-2"></i>
                Assign Ticket
              </button>

              <button
                className="btn btn-primary"
                onClick={handleAddAgent}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add Agent
              </button>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="agent-toolbar">
          <div className="agent-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search agents by name, email, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select agent-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Agent table */}
        <div className="table-responsive">
          <table className="table align-middle agent-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Assigned Tickets</th>
                <th>Workload</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No agents found.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const ticketCount = getAssignedCount(agent.name)

                  return (
                    <tr key={agent.id}>
                      <td>
                        <div className="agent-profile-cell">
                          <div className="agent-avatar">
                            {agent.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="agent-profile-info">
                            <span className="agent-profile-name">
                              {agent.name}
                            </span>
                            <span className="agent-profile-email">
                              {agent.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{agent.role}</td>

                      <td>
                        <span className="agent-department">
                          {agent.department}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`agent-status-badge ${agent.status === 'Active'
                            ? 'agent-status-active'
                            : 'agent-status-inactive'
                            }`}
                        >
                          {agent.status}
                        </span>
                      </td>

                      <td>
                        <span className="agent-ticket-count">
                          {ticketCount}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`agent-workload-badge ${getWorkloadClass(
                            ticketCount
                          )}`}
                        >
                          {getWorkloadLabel(ticketCount)}
                        </span>
                      </td>

                      <td className="agent-actions-cell">
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditAgent(agent)}
                            title="Edit agent"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className={`btn btn-sm ${agent.status === 'Active'
                              ? 'btn-outline-danger'
                              : 'btn-outline-success'
                              }`}
                            onClick={() => handleToggleStatus(agent.id)}
                            title={
                              agent.status === 'Active'
                                ? 'Deactivate agent'
                                : 'Activate agent'
                            }
                          >
                            <i
                              className={`bi ${agent.status === 'Active'
                                ? 'bi-person-dash'
                                : 'bi-person-check'
                                }`}
                            ></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteAgent(agent)}
                            title="Delete agent"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="agent-table-footer">
          Showing {filteredAgents.length} of {agents.length} agents
        </div>
      </div>

      {/* Add/Edit Agent Modal */}
      {showModal && (
        <div className="agent-modal-backdrop">
          <div className="agent-modal">
            <div className="agent-modal-header">
              <h5>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowModal(false)
                  setEditingAgent(null)
                  resetForm()
                }}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="agent-modal-body">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''
                      }`}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter agent name"
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''
                      }`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="agent@supportflow.com"
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    name="role"
                    className={`form-control ${formErrors.role ? 'is-invalid' : ''
                      }`}
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Support Agent"
                  />
                  {formErrors.role && (
                    <div className="invalid-feedback">{formErrors.role}</div>
                  )}
                </div>

                {/* Department */}
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    name="department"
                    className={`form-control ${formErrors.department ? 'is-invalid' : ''
                      }`}
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Technical Support"
                  />
                  {formErrors.department && (
                    <div className="invalid-feedback">
                      {formErrors.department}
                    </div>
                  )}
                </div>
              </div>

              <div className="agent-modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAgent(null)
                    resetForm()
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editingAgent ? 'Save Changes' : 'Add Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Ticket Modal */}
      {showAssignModal && (
        <div className="agent-modal-backdrop">
          <div className="agent-modal">
            <div className="agent-modal-header">
              <h5>Assign Ticket</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAssignModal(false)}
              ></button>
            </div>

            <form onSubmit={handleAssignTicket}>
              <div className="agent-modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Ticket</label>
                  <select
                    className="form-select"
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    required
                  >
                    <option value="">Choose a ticket</option>
                    {tickets.map((ticket) => (
                      <option key={ticket.id} value={ticket.id}>
                        #{ticket.id} — {ticket.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Assign to Agent</label>
                  <select
                    className="form-select"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    required
                  >
                    <option value="">Choose an active agent</option>
                    {agents
                      .filter((agent) => agent.status === 'Active')
                      .map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({getAssignedCount(agent.name)} tickets)
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="agent-modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agents