import type { Agent } from '../types/Agent'

export interface AgentFormData {
  name: string
  email: string
  role: string
  department: string
}

export interface AgentFormErrors {
  name: string
  email: string
  role: string
  department: string
}

export const validateAgentForm = (
  formData: AgentFormData,
  agents: Agent[],
  editingAgentId?: number
): AgentFormErrors => {
  const errors: AgentFormErrors = {
    name: '',
    email: '',
    role: '',
    department: '',
  }

  if (!formData.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Enter a valid email address'
  } else if (
    agents.some(
      (agent) =>
        agent.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        agent.id !== editingAgentId
    )
  ) {
    errors.email = 'This email already exists'
  }

  if (!formData.role.trim()) {
    errors.role = 'Role is required'
  }

  if (!formData.department.trim()) {
    errors.department = 'Department is required'
  }

  return errors
}