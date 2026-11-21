import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";
import Tickets from "../pages/tickets/Tickets";
import Customers from "../pages/customers/Customers";
import Agents from "../pages/agents/Agents";
import Settings from "../pages/settings/Settings";
import TicketDetails from "../pages/tickets/TicketDetails";
import CustomerDetails from "../pages/customers/CustomerDetails";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "tickets", element: <Tickets /> },
          { path: "tickets/:ticketId", element: <TicketDetails /> },
          { path: "customers", element: <Customers /> },
          { path: "customers/:customerId", element: <CustomerDetails /> },
          { path: "agents", element: <Agents /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;