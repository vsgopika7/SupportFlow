import {
  LayoutDashboard,
  Ticket,
  Users,
  UserRound,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { usePermission } from "../../hooks/usePermission";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const { can } = usePermission();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    visible: can("dashboard:view"),
    end: true,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: Ticket,
    visible:
      can("tickets:view_all") ||
      can("tickets:view_assigned") ||
      can("tickets:view_own"),
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
    visible: can("customers:view_all"),
  },
  {
    label: "Agents",
    path: "/agents",
    icon: UserRound,
    visible: can("agents:manage"),
  },
];

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h4 className="sidebar-logo">SupportFlow</h4>

        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      <p className="sidebar-heading">MAIN MENU</p>

      <ul className="sidebar-menu">
        {menuItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                  onClick={onClose}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
      </ul>

      <div className="sidebar-bottom">
        {can("settings:view") && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        )}

        <div
          className="sidebar-menu-item"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleLogout();
            }
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;