export type UserRole = "Admin" | "Agent" | "Customer";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type AuthenticatedUser = Omit<AuthUser, "password">;