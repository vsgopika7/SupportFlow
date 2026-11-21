import type { AuthUser } from "../types/Auth";

export const initialUsers: AuthUser[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@supportflow.com",
    password: "admin123",
    role: "Admin",
  },
  {
    id: 2,
    name: "Agent User",
    email: "agent@supportflow.com",
    password: "agent123",
    role: "Agent",
  },
  {
    id: 3,
    name: "Customer User",
    email: "customer@supportflow.com",
    password: "customer123",
    role: "Customer",
  },
];