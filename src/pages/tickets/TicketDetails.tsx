import './_TicketDetails.css'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, UserRound, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import StatusBadge from '../../components/ui/StatusBadge'
import PriorityBadge from '../../components/ui/PriorityBadge'
import type { Ticket } from '../../types/Ticket'
import useLocalStorage from '../../hooks/useLocalStorage'
import { initialTickets } from '../../data/tickets'
import { useAuth } from '../../context/useAuth'
// import type { TicketMessage } from '../../types/TicketMessage'
import toast from 'react-hot-toast'

function TicketDetails() {
  const { ticketId } = useParams()
  const { user } = useAuth()

  const [tickets, setTickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )
 

  const ticket = tickets.find(
    item => item.id === Number(ticketId)
  )

  const [selectedStatus, setSelectedStatus] =
    useState<Ticket['status']>('Open')

  // Keep selected status in sync with the ticket
  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status)
    }
  }, [ticket])

  // Ticket not found
  if (!ticket) {
    return (
      <div className="ticket-details-page">
        <h2>Ticket not found</h2>
        <Link to="/tickets" className="back-link">
          <ArrowLeft size={18} />
          Back to Tickets
        </Link>
      </div>
    )
  }

  // Check ticket viewing permission
  const canViewTicket = (() => {
    if (!user) return false

    if (user.role === 'Admin') return true

    if (user.role === 'Agent') {
      return ticket.assignedAgent === user.name
    }

    if (user.role === 'Customer') {
      return ticket.customer === user.name
    }

    return false
  })()

  const isAssignedAgent =
    user?.role === 'Agent' &&
    ticket.assignedAgent === user.name
  //handle the send message to customer
  // const handleSendMessage = () => {
  //   if (!isAssignedAgent || !user) {
  //     toast.error('You are not authorized to send a message.')
  //     return
  //   }

  //   if (!messageText.trim()) {
  //     toast.error('Please enter a message.')
  //     return
  //   }

  //   const newMessage: TicketMessage = {
  //     id: Math.max(0, ...messages.map(message => message.id)) + 1,
  //     ticketId: ticket.id,
  //     customer: ticket.customer,
  //     sender: user.name,
  //     message: messageText.trim(),
  //     createdAt: new Date().toISOString(),
  //   }

  //   setMessages([...messages, newMessage])
  //   setMessageText('')

  //   toast.success('Message sent to customer!')
  // }
  // Save status update
  const handleStatusUpdate = () => {
    if (!isAssignedAgent) {
      toast.error('You are not authorized to update this ticket.')
      return
    }

    setTickets(
      tickets.map(item =>
        item.id === ticket.id
          ? { ...item, status: selectedStatus }
          : item
      )
    )

    toast.success(`Ticket #${ticket.id} status updated to ${selectedStatus}`)
  }

  // Access denied
  if (!canViewTicket) {
    return (
      <div className="ticket-details-page">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this ticket.</p>

        <Link to="/tickets" className="back-link">
          <ArrowLeft size={18} />
          Back to Tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="ticket-details-page">

      {/* Back button */}
      <Link to="/tickets" className="back-link">
        <ArrowLeft size={18} />
        Back to Tickets
      </Link>

      {/* Ticket header */}
      <div className="ticket-details-header">
        <div>
          <p className="ticket-id-label">
            Ticket #{ticket.id}
          </p>

          <h2 className="ticket-details-title">
            {ticket.subject}
          </h2>
        </div>

        <div>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Main content */}
      <div className="row g-4">

        {/* Description */}
        <div className="col-lg-8">
          <div className="ticket-details-card">
            <h5 className="ticket-section-title">
              Ticket Description
            </h5>

            <p className="ticket-description">
              {ticket.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Ticket information */}
        <div className="col-lg-4">
          <div className="ticket-details-card">
            <h5 className="ticket-section-title">
              Ticket Information
            </h5>

            <div className="ticket-info-item">
              <Tag size={18} />
              <div>
                <small>Category</small>
                <p>{ticket.category}</p>
              </div>
            </div>

            <div className="ticket-info-item">
              <UserRound size={18} />
              <div>
                <small>Customer</small>
                <p>{ticket.customer}</p>
              </div>
            </div>

            <div className="ticket-info-item">
              <UserRound size={18} />
              <div>
                <small>Assigned Agent</small>
                <p>{ticket.assignedAgent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status Update */}
      {isAssignedAgent && (
        <div className="ticket-details-card mt-4">
          <h5 className="ticket-section-title">
            Update Ticket Status
          </h5>

          <div className="form-group">
            <label htmlFor="ticketStatus">Ticket Status</label>

            <select
              id="ticketStatus"
              className="form-select"
              value={selectedStatus}
              onChange={event =>
                setSelectedStatus(
                  event.target.value as Ticket['status']
                )
              }
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Customer">
                Waiting for Customer
              </option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleStatusUpdate}
            disabled={selectedStatus === ticket.status}
          >
            Save Status
          </button>
        </div>
      )}
      {/* Agent Message to Customer
      {isAssignedAgent && (
        <div className="ticket-details-card mt-4">
          <h5 className="ticket-section-title">
            Send Message to Customer
          </h5>

          <p>
            Customer: <strong>{ticket.customer}</strong>
          </p>

          <div className="form-group">
            <label htmlFor="agentMessage">
              Message
            </label>

            <textarea
              id="agentMessage"
              className="form-control"
              rows={4}
              placeholder="Write an update or resolution message for the customer..."
              value={messageText}
              onChange={event => setMessageText(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            Send Message
          </button>
        </div>
      )} */}
    </div>
  )
}

export default TicketDetails