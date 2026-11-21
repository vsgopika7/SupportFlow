import { useAuth } from "../context/useAuth";
import { hasPermission } from "../utils/permissions";
import type { Permission } from "../utils/permissions";

export function usePermission() {
  const { user } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!user) {
      return false;
    }
    return hasPermission(user.role, permission);
  };
  return { can };
}