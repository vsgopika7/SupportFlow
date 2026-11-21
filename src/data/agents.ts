import type { Agent } from '../types/Agent'

export const initialAgents: Agent[] = [
  {
    id: 1,
    name: 'Ananya Sharma',
    email: 'ananya@supportflow.com',
    role: 'Senior Support Agent',
    department: 'Technical Support',
    status: 'Active',
    assignedTickets: 5,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    email: 'rahul@supportflow.com',
    role: 'Support Agent',
    department: 'Customer Service',
    status: 'Active',
    assignedTickets: 3,
  },
  {
    id: 3,
    name: 'Priya Nair',
    email: 'priya@supportflow.com',
    role: 'Support Agent',
    department: 'Technical Support',
    status: 'Active',
    assignedTickets: 4,
  },
  {
    id: 4,
    name: 'Karthik Reddy',
    email: 'karthik@supportflow.com',
    role: 'Team Lead',
    department: 'Technical Support',
    status: 'Active',
    assignedTickets: 2,
  },
  {
    id: 5,
    name: 'Sneha Patel',
    email: 'sneha@supportflow.com',
    role: 'Support Agent',
    department: 'Billing',
    status: 'Inactive',
    assignedTickets: 0,
  },
]