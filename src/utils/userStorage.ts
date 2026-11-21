import { initialUsers } from "../data/users";
import type { AuthUser } from "../types/Auth";

const USERS_KEY = "supportflow-users";

export const getUsers = (): AuthUser[] => {
  const storedUsers = localStorage.getItem(USERS_KEY);

  if (storedUsers === null) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }

  return JSON.parse(storedUsers) as AuthUser[];
};

export const saveUsers = (users: AuthUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};