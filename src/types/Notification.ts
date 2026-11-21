export interface Notification {
  id: string
  title: string
  message: string
  ticketId: number
  type: 'created' | 'assigned' | 'status' | 'resolved'
  createdAt: string
  read: boolean
  recipientRole: 'Admin' | 'Agent' | 'Customer'
  recipientAgent?: string
}