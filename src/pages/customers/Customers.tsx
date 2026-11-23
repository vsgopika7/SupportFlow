import PageHeader from '../../components/common/PageHeader'
import { initialCustomers } from '../../data/customers'
import type { Customer } from '../../types/Customer'
import useLocalStorage from '../../hooks/useLocalStorage'
import React, { useState,useMemo } from 'react'
import { Link } from 'react-router-dom'
import { validateCustomerForm } from '../../utils/customerValidation'
import type { CustomerFormErrors } from '../../utils/customerValidation'
import './Customers.css'
import { initialTickets } from '../../data/tickets'
import type { Ticket } from '../../types/Ticket'

function Customers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const [customers, setCustomers] = useLocalStorage<Customer[]>(
    'supportflow-customers',
    initialCustomers
  )
  const [tickets] = useLocalStorage<Ticket[]>(
    'supportflow-tickets',
    initialTickets
  )
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })

  const [errors, setErrors] = useState<CustomerFormErrors>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Search customers
  // Search customers
const filteredCustomers = useMemo(() => {
  const search = searchTerm.toLowerCase()

  return customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.company.toLowerCase().includes(search)
  )
}, [customers, searchTerm])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
    })

    setErrors({})
    setEditingCustomer(null)
  }

  // Open Add Customer modal
  const handleAddClick = () => {
    resetForm()
    setSuccessMessage('')
    setShowModal(true)
  }

  // Open Edit Customer modal
  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer)

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
    })

    setErrors({})
    setSuccessMessage('')
    setShowModal(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }
  // handle delete 
  const handleDeleteCustomer = (customer: Customer) => {
    const customerTickets = tickets.filter(
      (ticket) => ticket.customer === customer.name
    )
    if (customerTickets.length > 0) {
      setSuccessMessage(
        `Cannot delete ${customer.name}. This customer has ${customerTickets.length} linked ticket(s).`
      )
      return
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    )
    if (!confirmed) return
    setCustomers((prevCustomers) =>
      prevCustomers.filter((item) => item.id !== customer.id)
    )
    setSuccessMessage(`${customer.name} deleted successfully!`)
  }
  // Handle form submission for both Add and Edit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateCustomerForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    // Check duplicate email (exclude the current customer while editing)
    const emailExists = customers.some(
      (customer) =>
        customer.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        customer.id !== editingCustomer?.id
    )

    if (emailExists) {
      setErrors({
        email: 'A customer with this email already exists',
      })
      return
    }

    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer: Customer = {
        ...editingCustomer,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
      }

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === editingCustomer.id ? updatedCustomer : customer
        )
      )

      setSuccessMessage('Customer updated successfully!')
    } else {
      // Create new customer
      const newCustomer: Customer = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        totalTickets: 0,
      }

      setCustomers((prevCustomers) => [...prevCustomers, newCustomer])

      setSuccessMessage('Customer added successfully!')
    }

    setShowModal(false)
    resetForm()
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customer information."
      />

      <div className="card p-4 customer-management-card">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Customer Management</h5>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary">
              {customers.length} Customers
            </span>

            <button className="btn btn-primary" onClick={handleAddClick}>
              <i className="bi bi-plus-lg me-2"></i>
              Add Customer
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show mt-3">
            {successMessage}

            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage('')}
            ></button>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          className="form-control mt-3 mb-3"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Customer Table */}
        <div className="table-responsive mt-3">
          <table className="table table-hover align-middle customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th className="text-center">Total Tickets</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <Link
                        to={`/customers/${customer.id}`}
                        className="text-decoration-none fw-semibold customer-name">
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark customer-ticket-badge">
                        {customer.totalTickets}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(customer)}
                          title="Edit customer"
                        >
                          <i className="bi bi-pencil-square "></i>
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCustomer(customer)}
                          title="Delete customer"
                        >
                          <i className="bi bi-trash"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="customer-modal-backdrop">
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content customer-modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                {/* Modal Body */}
                <div className="modal-body">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">Customer Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter customer name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && (
                        <div className="text-danger small mt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <div className="text-danger small mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    {/* Phone */}
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {errors.phone && (
                        <div className="text-danger small mt-1">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                    {/* Company */}
                    <div className="mb-3">
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        name="company"
                        className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                        placeholder="Enter company name"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                      {errors.company && (
                        <div className="text-danger small mt-1">
                          {errors.company}
                        </div>
                      )}
                    </div>
                    {/* Modal Footer */}
                    <div className="modal-footer px-0 pb-0">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingCustomer ? 'Save Changes' : 'Add Customer'}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers