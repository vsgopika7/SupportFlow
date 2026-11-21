import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'

import type { Ticket } from '../../types/Ticket'

interface TicketStatusChartProps {
    tickets: Ticket[]
}
function TicketStatusChart({ tickets }: TicketStatusChartProps) {
    const chartData = [
        {
            status: 'Open',
            count: tickets.filter((ticket) => ticket.status === 'Open').length
        },
        {
            status: 'Assigned',
            count: tickets.filter((ticket) => ticket.status === 'Assigned').length
        },
        {
            status: 'In Progress',
            count: tickets.filter((ticket) => ticket.status === 'In Progress').length
        },
        {
            status: 'Waiting',
            count: tickets.filter((ticket) => ticket.status === 'Waiting for Customer').length
        },
        {
            status: 'Resolved',
            count: tickets.filter((ticket) => ticket.status === 'Resolved').length
        },
        {
            status: 'Closed',
            count: tickets.filter((ticket) => ticket.status === 'Closed').length
        }
    ]
    return (
        <div className="ticket-status-chart">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                    <CartesianGrid vertical={false}
                        stroke="#e5e7eb" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value} tickets`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.status === 'Open' ? '#3b82f6' :
                                    entry.status === 'Assigned' ? '#8b5cf6' :
                                    entry.status === 'In Progress' ? '#f59e0b' :
                                    entry.status === 'Waiting' ? '#f97316' :
                                    entry.status === 'Resolved' ? '#10b981' :
                                   '#64748b'
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
export default TicketStatusChart