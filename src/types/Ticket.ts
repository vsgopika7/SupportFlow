export interface Ticket {
  id: number
  subject: string
  customer: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status:
    | 'Open'
    | 'Assigned'
    | 'In Progress'
    | 'Waiting for Customer'
    | 'Resolved'
    | 'Closed'
  category: string
  assignedAgent: string
  description: string
}