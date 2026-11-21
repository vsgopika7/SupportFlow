import PageHeader from '../../components/common/PageHeader'
import { Link, useParams } from 'react-router-dom'
import { initialCustomers } from '../../data/customers'
import type { Customer } from '../../types/Customer'
import useLocalStorage from '../../hooks/useLocalStorage'
import { initialTickets } from '../../data/tickets'
import type { Ticket } from '../../types/Ticket'
function CustomerDetails() {
    const { customerId } = useParams()
    const [customers] = useLocalStorage<Customer[]>('supportflow-customers', initialCustomers)
    const [tickets] = useLocalStorage<Ticket[]>(
        'supportflow-tickets',
        initialTickets
    )
    const customer = customers.find(
        (customer) => customer.id === Number(customerId)
    )
    const customerTickets = tickets.filter(
        (ticket) => ticket.customer === customer?.name
    )
    return (
        <div>
            <PageHeader
                title="Customer Details"
                description="View detailed customer information."
            />
            <Link to='/customers' className='btn btn-outline-secondary mb-3'>
                <i className='bi bi-arrow-left me-2'></i>
                Back to Cutomers</Link>
            {customer ? (
                <div className="card p-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div
                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                            style={{ width: '55px', height: '55px', fontSize: '20px' }}
                        >
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h5 className="mb-1">{customer.name}</h5>
                            <span className="text-muted small">Customer ID: #{customer.id}</span>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6 mb-3">
                            <strong>Name</strong>
                            <p>{customer.name}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Email</strong>
                            <p>{customer.email}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Phone</strong>
                            <p>{customer.phone}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Company</strong>
                            <p>{customer.company}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Total Tickets</strong>
                            <p>{customer.totalTickets}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">
                    Customer not found.
                </div>
            )}
            <div className="card p-4 mt-4">
                <h5>Ticket Summary</h5>

                <div className="row mt-3">
                    <div className="col-md-4">
                        <div className="border rounded p-3">
                            <p className="text-muted mb-1">Total Tickets</p>
                            <h3 className="mb-0">{customerTickets.length}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card p-4 mt-4">
                <h5>Customer Tickets</h5>

                <div className="table-responsive mt-3">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customerTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-4">
                                        No tickets found for this customer.
                                    </td>
                                </tr>
                            ) : (
                                customerTickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td>
                                            <Link
                                                to={`/tickets/${ticket.id}`}
                                                className="text-decoration-none fw-semibold">
                                                {ticket.subject}
                                            </Link>
                                        </td>
                                        <td>{ticket.category}</td>
                                        <td>{ticket.priority}</td>
                                        <td>{ticket.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CustomerDetails