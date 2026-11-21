
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, AuthenticatedUser } from "../types/Auth";
import type { Agent } from "../types/Agent";
import { getUsers } from "../utils/userStorage";

const SESSION_KEY = "supportflow-session";
const AGENTS_KEY = "supportflow-agents";
const DEFAULT_AGENT_PASSWORD = "agent123";

interface AuthContextType {
  user: AuthenticatedUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      return null;
    }

    return JSON.parse(storedSession) as AuthenticatedUser;
  });

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Agent accounts from Agents Management
    const storedAgents = localStorage.getItem(AGENTS_KEY);
    const agents: Agent[] = storedAgents
      ? (JSON.parse(storedAgents) as Agent[])
      : [];

    const matchedAgent = agents.find(
      agent => agent.email.toLowerCase() === normalizedEmail
    );

    if (matchedAgent) {
      // Reject inactive agents
      if (matchedAgent.status !== "Active") {
        return false;
      }

      // Agent demo password
      if (password !== DEFAULT_AGENT_PASSWORD) {
        return false;
      }

      // Create authenticated Agent user
      const authenticatedAgent: AuthenticatedUser = {
        id: -matchedAgent.id,
        name: matchedAgent.name,
        email: matchedAgent.email,
        role: "Agent",
      };

      setUser(authenticatedAgent);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(authenticatedAgent)
      );

      return true;
    }

    // 2. Check existing Admin and Customer accounts
    const users: AuthUser[] = getUsers();

    const matchedUser = users.find(
      user =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
    );

    if (!matchedUser) {
      return false;
    }

    // Remove password before storing session
    const authenticatedUser: AuthenticatedUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    setUser(authenticatedUser);

    // Persist login session
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(authenticatedUser)
    );

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// }
