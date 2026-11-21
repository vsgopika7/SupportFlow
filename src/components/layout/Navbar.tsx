import {
  Search,
  Bell,
  UserRound,
  Menu,
  X,
  CheckCheck
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import useLocalStorage from '../../hooks/useLocalStorage'
import type { Ticket } from '../../types/Ticket'
import { initialTickets } from '../../data/tickets'
import type { Notification } from '../../types/Notification'
interface NavbarProps {
  onMenuClick: () => void
}

function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    'supportflow-notifications',
    []
  )

  const [showNotifications, setShowNotifications] = useState(false)

  const roleNotifications = notifications.filter(notification => {
    if (notification.recipientRole !== user?.role) {
      return false
    }
    if (user?.role === 'Agent') {
      return notification.recipientAgent === user.name
    }
    return true
  })

  const unreadCount = roleNotifications.filter(
    notification => !notification.read
  ).length

  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)

  const roleLabel =
    user?.role === 'Admin'
      ? 'Administrator'
      : user?.role === 'Agent'
        ? 'Support Agent'
        : user?.role === 'Customer'
          ? 'Customer'
          : ''

  // Filter tickets based on logged-in role
  const visibleTickets = tickets.filter(ticket => {
    if (!user) return false

    if (user.role === 'Admin') return true
    if (user.role === 'Agent') return ticket.assignedAgent === user.name
    if (user.role === 'Customer') return ticket.customer === user.name

    return false
  })

  // Search tickets by ID or subject
  const searchResults = visibleTickets.filter(ticket => {
    const query = searchTerm.trim().toLowerCase()

    return (
      ticket.id.toString().includes(query) ||
      ticket.subject.toLowerCase().includes(query)
    )
  })

  const handleTicketClick = (ticketId: number) => {
    setSearchTerm('')
    setShowResults(false)
    navigate(`/tickets/${ticketId}`)
  }

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        <div className="welcome-section">
          <h3>Welcome back, {user?.name || 'User'}!</h3>
          <p>Here's what's happening with your support tickets.</p>
        </div>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search-wrapper">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search tickets Id,Subject.."
              value={searchTerm}
              onChange={event => {
                setSearchTerm(event.target.value)
                setShowResults(true)
              }}
              onFocus={() => {
                if (searchTerm.trim()) setShowResults(true)
              }}
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchTerm('')
                  setShowResults(false)
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showResults && searchTerm.trim() && (
            <div className="search-results-dropdown">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 6).map(ticket => (
                  <button
                    key={ticket.id}
                    type="button"
                    className="search-result-item"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <div className="search-result-id">
                      #{ticket.id}
                    </div>

                    <div className="search-result-info">
                      <strong>{ticket.subject}</strong>
                      <small>
                        {ticket.status} · {ticket.priority}
                      </small>
                    </div>
                  </button>
                ))
              ) : (
                <div className="search-no-results">
                  No matching tickets found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications - unchanged */}
        <div className="notification-wrapper">
          <button
            type="button"
            className="notification-icon"
            onClick={() => {
              setShowNotifications(prev => !prev)
              setShowResults(false)
            }}
            aria-label="Notifications"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h6>Notifications</h6>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotifications(prev =>
                        prev.map(notification => ({
                          ...notification,
                          read: true,
                        }))
                      )
                    }}
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}
              </div>

              {roleNotifications.length > 0 ? (
                <div className="notification-list">
                  {roleNotifications.map(notification => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'
                        }`}
                      onClick={() => {
                        setNotifications(prev =>
                          prev.map(item =>
                            item.id === notification.id
                              ? { ...item, read: true }
                              : item
                          )
                        )

                        setShowNotifications(false)
                        navigate(`/tickets/${notification.ticketId}`)
                      }}
                    >
                      <div className="notification-content">
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                        <small>
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>

                      {!notification.read && (
                        <span className="notification-unread-indicator"></span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="notification-empty">
                  <Bell size={25} />
                  <p>No notifications yet</p>
                  <small>You're all caught up!</small>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Profile */}
        <div className="profile-section">
          <div className="profile-avatar">
            <UserRound size={22} />
          </div>

          <div className="profile-details">
            <h6>{user?.name || 'User'}</h6>
            <small>{roleLabel}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar