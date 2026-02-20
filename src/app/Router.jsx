import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";
import ProjectsPage from "../components/projects/freelancer/ProjectsPage";
import MyProjectsPage from "../components/projects/employer/MyProjectsPage";
import MessagesPage from "../components/messages/MessagesPage";
import ProjectDetailsPage from "../components/projects/ProjectDetailsPage";
import ProposalsPage from "../components/proposals/ProposalsPage";
import ProposalDetailsPage from "../components/proposals/ProposalDetailsPage";
import RoleBasedDashboard from "../components/dashboard/RoleBasedDashboard";
import PaymentsPage from "../components/finance/employer/PaymentsPage";
import EarningsPage from "../components/finance/freelancer/EarningsPage";

const Placeholder = ({ title }) => (
  <div style={{ padding: 20 }}>{title}</div>
);

export const Router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <RoleBasedDashboard /> },

      // freelancer
      { path: "projects", element: <ProjectsPage /> },
      { path: "proposals", element: <ProposalsPage /> },
      { path: "proposals/:id/:slug", element: <ProposalDetailsPage /> },

      // employer
      { path: "my-projects", element: <MyProjectsPage /> },

      // ✅ proposals are shown inside /my-projects (no separate page needed)
      // (kept route removed to avoid confusion)
      // { path: "my-projects/:id/proposals", element: <Placeholder title="Project Proposals" /> },

      // shared
      { path: "projects/:id/:slug", element: <ProjectDetailsPage /> },

      { path: "messages", element: <MessagesPage /> },
      { path: "settings", element: <Placeholder title="Settings" /> },

      // optional placeholders for dashboard links (avoid 404 if used)
      { path: "payments", element: <PaymentsPage /> },
      { path: "earnings", element: <EarningsPage /> },
      { path: "contracts", element: <Placeholder title="Contracts" /> },
    ],
  },
]);