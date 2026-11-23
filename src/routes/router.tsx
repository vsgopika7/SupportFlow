import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Tickets = lazy(() => import("../pages/tickets/Tickets"));
const Customers = lazy(() => import("../pages/customers/Customers"));
const Agents = lazy(() => import("../pages/agents/Agents"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const TicketDetails = lazy(() => import("../pages/tickets/TicketDetails"));
const CustomerDetails = lazy(() => import("../pages/customers/CustomerDetails"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

function PageLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Register />
      </Suspense>
    ),
  },

  // Protected routes
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute />
      </Suspense>
      ),
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