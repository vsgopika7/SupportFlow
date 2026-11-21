export interface CustomerFormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
}

export const validateCustomerForm = (formData: {
  name: string
  email: string
  phone: string
  company: string
}): CustomerFormErrors => {
  const errors: CustomerFormErrors = {}

  if (!formData.name.trim()) {
    errors.name = 'Customer name is required'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Phone number must contain 10 digits'
  }

  if (!formData.company.trim()) {
    errors.company = 'Company name is required'
  }

  return errors
}