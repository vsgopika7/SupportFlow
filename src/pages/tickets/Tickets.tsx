
import PageHeader from '../../components/common/PageHeader'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Tickets.css'
import StatusBadge from '../../components/ui/StatusBadge'
import PriorityBadge from '../../components/ui/PriorityBadge'
import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import type { Ticket } from '../../types/Ticket'
import { initialTickets } from '../../data/tickets'
import { useAuth } from '../../context/useAuth'
import { initialAgents } from '../../data/agents'
import type { Agent } from '../../types/Agent'
import toast from 'react-hot-toast'
import type { Notification } from '../../types/Notification'
import { addNotification } from '../../utils/notificationStorage'
function Tickets() {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )

  const [agents] = useLocalStorage<Agent[]>(
    'supportflow-agents',
    initialAgents
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

  const [formData, setFormData] = useState({
    subject: '',
    customer: '',
    category: '',
    priority: 'Medium',
    status: 'Open',
    assignedAgent: '',
    description: '',
  })

  const [errors, setErrors] = useState({
    subject: '',
    customer: '',
    category: '',
    assignedAgent: '',
    description: '',
  })

  // Get logged-in user
  const { user } = useAuth()

  // Find the logged-in agent using their email
  const loggedInAgent = agents.find(
    agent =>
      user?.email &&
      agent.email.toLowerCase() === user.email.toLowerCase()
  )

  // Determine permissions
  const isAdmin = user?.role === 'Admin'
  const isAgent = user?.role === 'Agent'
  const isCustomer = user?.role === 'Customer'
  // Check whether the current user can manage a specific ticket
  const canManageTicket = (ticket: Ticket): boolean => {
    if (!user) return false

    // Admin can manage every ticket
    if (isAdmin) return true

    // Agent can manage tickets assigned to them
    if (isAgent) {
      const agentName = loggedInAgent?.name || user.name
      return ticket.assignedAgent === agentName
    }

    // Customer can manage tickets belonging to them
    if (isCustomer) {
      return ticket.customer === user.name
    }

    return false
  }
  // Filter tickets based on user role
  const roleFilteredTickets = tickets.filter(ticket => {
    if (!user) return false

    // Admin can see all tickets
    if (isAdmin) {
      return true
    }

    // Agent can see tickets assigned to their agent profile
    if (isAgent) {
      const agentName = loggedInAgent?.name || user.name
      return ticket.assignedAgent === agentName
    }

    // Customer can see only their own tickets
    if (isCustomer) {
      return ticket.customer === user.name
    }

    return false
  })

  // Apply search, status and priority filters
  const filteredTickets = roleFilteredTickets.filter(ticket => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assignedAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toString().includes(searchTerm)

    const matchesStatus =
      statusFilter === 'All' || ticket.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Form validation
  const validateForm = () => {
    const newErrors = {
      subject: '',
      customer: '',
      category: '',
      assignedAgent: '',
      description: '',
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer name is required'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (isAdmin && !formData.assignedAgent) {
      newErrors.assignedAgent = 'Please select an agent'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  // Create or update ticket
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    if (editingTicket) {
      // Update existing ticket
      const updatedTicket: Ticket = {
        ...editingTicket,
        subject: formData.subject,
        customer: formData.customer,
        category: formData.category,
        priority: formData.priority as Ticket['priority'],
        status: formData.status as Ticket['status'],
        assignedAgent: formData.assignedAgent,
        description: formData.description,
      }

      setTickets(
        tickets.map(ticket =>
          ticket.id === editingTicket.id ? updatedTicket : ticket
        )
      )
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        id: Math.max(0, ...tickets.map(ticket => ticket.id)) + 1,
        subject: formData.subject,
        customer: formData.customer,
        category: formData.category,
        priority: formData.priority as Ticket['priority'],
        status: 'Open',
        assignedAgent: isCustomer ? 'Unassigned' : formData.assignedAgent,
        description: formData.description,
      }

      setTickets([...tickets, newTicket])

      // Notify Admin when a customer creates a ticket
      if (isCustomer) {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          title: 'New Ticket Created',
          message: `${formData.customer} created Ticket #${newTicket.id} — ${newTicket.subject}. Awaiting agent assignment.`,
          ticketId: newTicket.id,
          type: 'created',
          createdAt: new Date().toISOString(),
          read: false,
          recipientRole: 'Admin',
        }

        addNotification(notification)
      }
    }
    handleCloseModal()
  }

  // Edit ticket
  const handleEdit = (ticket: Ticket) => {
    if (!canManageTicket(ticket)) return

    setEditingTicket(ticket)

    setFormData({
      subject: ticket.subject,
      customer: ticket.customer,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      assignedAgent: ticket.assignedAgent,
      description: ticket.description,
    })

    setIsModalOpen(true)
  }

  // Reset and close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTicket(null)

    setFormData({
      subject: '',
      customer: '',
      category: '',
      priority: 'Medium',
      status: 'Open',
      assignedAgent: '',
      description: '',
    })

    setErrors({
      subject: '',
      customer: '',
      category: '',
      assignedAgent: '',
      description: '',
    })
  }

  // Delete ticket
  const handleDelete = (ticketId: number) => {
    const ticket = tickets.find(item => item.id === ticketId)

    if (!ticket || !canManageTicket(ticket)) {
      toast.error('You are not authorized to delete this ticket.')
      return
    }
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete ticket #{ticketId}?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => {
                setTickets(tickets.filter(ticket => ticket.id !== ticketId))
                toast.success(`Ticket #${ticketId} deleted successfully!`)
                toast.dismiss(t.id)
              }}
            >Delete
            </button>
            <button onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  // Get active agents belonging to the selected department
  const availableAgents = agents.filter(
    agent =>
      agent.status === 'Active' &&
      agent.department === formData.category
  )

  return (
    <div className="tickets-page">
      <PageHeader
        title="Tickets"
        description="View and manage support tickets."
      />

      <div className="tickets-container">
        <div className="tickets-header">
          <h4>Tickets Management</h4>
          <p>Manage customer support tickets and track their progress.</p>
        </div>

        {/* Toolbar */}
        <div className="tickets-toolbar">
          <div className="tickets-search">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="tickets-filter">
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="tickets-filter">
            <select
              value={priorityFilter}
              onChange={event => setPriorityFilter(event.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            className="create-ticket-btn"
            onClick={() => {
              setEditingTicket(null)

              setFormData({
                subject: '',
                customer: '',
                category: '',
                priority: 'Medium',
                status: 'Open',
                assignedAgent: '',
                description: '',
              })

              setErrors({
                subject: '',
                customer: '',
                category: '',
                assignedAgent: '',
                description: '',
              })

              setIsModalOpen(true)
            }}
          >
            + Create Ticket
          </button>
        </div>

        {/* Tickets table */}
        <div className="table-responsive">
          <table className="table tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.customer}</td>
                    <td>{ticket.category}</td>

                    <td>
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    <td>
                      <StatusBadge status={ticket.status} />
                    </td>

                    <td>{ticket.assignedAgent}</td>

                    <td>
                      {/* View ticket - everyone with access can view */}
                      <Link
                        to={`/tickets/${ticket.id}`}
                        state={{ ticket }}
                        className="ticket-view-link"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Edit and Delete - Admin and ticket-owning Customer */}
                      {(isAdmin || isCustomer) && canManageTicket(ticket) && (
                        <>
                          <button
                            type="button"
                            className="ticket-edit-btn"
                            onClick={() => handleEdit(ticket)}
                            title="Edit Ticket"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            className="ticket-delete-btn"
                            onClick={() => handleDelete(ticket.id)}
                            title="Delete Ticket"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <div className="empty-state-content">
                      <h5>No tickets found</h5>
                      <p>
                        No tickets match your current search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <h3>{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</h3>

            <form onSubmit={handleSubmit}>
              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Enter ticket subject"
                  value={formData.subject}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      subject: event.target.value,
                    })
                  }
                />

                {errors.subject && (
                  <small className="form-error">{errors.subject}</small>
                )}
              </div>

              {/* Customer */}
              <div className="form-group">
                <label htmlFor="customer">Customer Name</label>
                <input
                  type="text"
                  id="customer"
                  placeholder="Enter customer name"
                  value={formData.customer}
                  readOnly={isCustomer && !!editingTicket}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      customer: event.target.value,
                    })
                  }
                />

                {errors.customer && (
                  <small className="form-error">{errors.customer}</small>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  value={formData.category}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      category: event.target.value,
                      assignedAgent: '',
                    })
                  }
                >
                  <option value="">Select category</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Billing">Billing</option>
                  <option value="Customer Support">Customer Support</option>
                </select>

                {errors.category && (
                  <small className="form-error">{errors.category}</small>
                )}
              </div>

              {/* Priority */}
              <div className="form-group">
                <label htmlFor="priority">Priority</label>

                <select
                  id="priority"
                  value={formData.priority}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      priority: event.target.value,
                    })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              {isAdmin && (
                // status
                < div className="form-group">
                  <label htmlFor="status">Status</label>

                  <select
                    id="status"
                    value={formData.status}
                    onChange={event =>
                      setFormData({
                        ...formData,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>)}

              {/* Assigned Agent */}
              {isAdmin && (
                <div className="form-group">
                  <label htmlFor="assignedAgent">Assigned Agent</label>

                  <select
                    id="assignedAgent"
                    value={formData.assignedAgent}
                    onChange={event =>
                      setFormData({
                        ...formData,
                        assignedAgent: event.target.value,
                      })
                    }
                  >
                    <option value="">Select agent</option>

                    {availableAgents.map(agent => (
                      <option key={agent.id} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </select>

                  {errors.assignedAgent && (
                    <small className="form-error">
                      {errors.assignedAgent}
                    </small>
                  )}
                </div>)}

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the issue..."
                  value={formData.description}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                />

                {errors.description && (
                  <small className="form-error">{errors.description}</small>
                )}
              </div>

              {/* Modal actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-ticket-btn">
                  {editingTicket ? 'Save Changes' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div >
      )
      }
    </div >
  )
}

export default Tickets
