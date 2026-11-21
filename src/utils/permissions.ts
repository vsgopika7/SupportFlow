import type { UserRole } from "../types/Auth";

export type Permission =
  | "dashboard:view"
  | "tickets:view_all"
  | "tickets:view_assigned"
  | "tickets:view_own"
  | "tickets:create"
  | "tickets:edit_all"
  | "tickets:update_assigned_status"
  | "tickets:delete"
  | "tickets:assign"
  | "customers:view_all"
  | "customers:view_relevant"
  | "customers:view_own"
  | "customers:manage"
  | "agents:manage"
  | "settings:view";

export const rolePermissions: Record<UserRole, Permission[]> = {
  Admin: [
    "dashboard:view",
    "tickets:view_all",
    "tickets:create",
    "tickets:edit_all",
    "tickets:delete",
    "tickets:assign",
    "customers:view_all",
    "customers:manage",
    "agents:manage",
    "settings:view",
  ],

  Agent: [
    "dashboard:view",
    "tickets:view_assigned",
    "tickets:create",
    "tickets:update_assigned_status",
    "customers:view_relevant",
    "settings:view",
    "customers:view_all",
  ],

  Customer: [
    "dashboard:view",
    "tickets:view_own",
    "tickets:create",
    "customers:view_own",
    "settings:view",
  ],
};

export const hasPermission = (
  role: UserRole,
  permission: Permission,
): boolean => {
  return rolePermissions[role].includes(permission);
};