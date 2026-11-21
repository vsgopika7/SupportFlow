import type { Customer } from '../types/Customer'

export const initialCustomers: Customer[] = [
    {
        id: 1,
        name: 'Arun Kumar',
        email: 'arun@gmail.com',
        phone: '9876543210',
        company: 'Tech Solutions',
        totalTickets: 3
    },
    {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@gmail.com',
        phone: '9876543211',
        company: 'Infosys',
        totalTickets: 5
    },
    {
        id: 3,
        name: 'Rahul Reddy',
        email: 'rahul@gmail.com',
        phone: '9876543212',
        company: 'Wipro',
        totalTickets: 2
    },
    {
        id: 4,
        name: 'Sneha Rao',
        email: 'sneha@gmail.com',
        phone: '9876543213',
        company: 'Accenture',
        totalTickets: 4
    }
]