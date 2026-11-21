import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts'
import type { Ticket } from '../../types/Ticket'
interface TicketPriorityChartProps {
    tickets: Ticket[]
}

function TicketPriorityChart({ tickets }: TicketPriorityChartProps) {
    const chartData = [
        {
            priority: 'Low',
            count: tickets.filter((ticket) => ticket.priority === 'Low').length
        },
        {
            priority: 'Medium',
            count: tickets.filter((ticket) => ticket.priority === 'Medium').length
        },
        {
            priority: 'High',
            count: tickets.filter((ticket) => ticket.priority === 'High').length
        }
    ]

    return (
        <div className="ticket-priority-chart">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                    <CartesianGrid vertical={false}
                        stroke="#e5e7eb" />
                    <XAxis dataKey="priority" />
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
                                    entry.priority === 'Low' ? '#10b981' :
                                    entry.priority === 'Medium' ? '#f59e0b' :
                                    entry.priority === 'High' ? '#ef4444' :
                                    '#7c2d12'
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TicketPriorityChart