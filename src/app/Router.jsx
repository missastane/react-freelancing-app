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
import ContractsPage from "../components/contracts/ContractsPage";
import ContractWorkspacePage from "../components/contracts/ContractWorkSpacePage";
import ProfilePage from "../components/profile/shared/ProfilePage";
import AccountSettings from "../components/setting/shared/AccountSettings";
import SecuritySettings from "../components/setting/shared/SecuritySettings";
import NotificationsSettings from "../components/setting/shared/NotificationsSettings";
import SettingsLayout from "../components/setting/shared/SettingsLayout";
import ActivityLogSettings from "../components/setting/shared/ActivityLogSettings";
import PrivacySettings from "../components/setting/shared/PrivacySettings";
import ConnectedAccountsSettings from "../components/setting/shared/ConnectedAccountsSettings";
import AdminProjectCategories from "../components/admin/pages/AdminProjectCategories";
import AdminLayout from "../components/admin/layouts/AdminLayout";
import AdminDashboard from "../components/admin/pages/dashboard/AdminDashboard";
import AdminUsers from "../components/admin/pages/AdminUsers";
import AdminSkills from "../components/admin/pages/AdminSkills";
import AdminTickets from "../components/admin/pages/AdminTickets";
import AdminContent from "../components/admin/pages/AdminContent";
import AdminReports from "../components/admin/pages/AdminReports";
import AdminSettings from "../components/admin/pages/AdminSettings";

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
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "skills", element: <AdminSkills /> },
          { path: "projects", element: <AdminProjectCategories /> },
          { path: "tickets", element: <AdminTickets /> },
          { path: "content", element: <AdminContent /> },
          { path: "reports", element: <AdminReports /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <RoleBasedDashboard /> },
      { path: "profile", element: <ProfilePage /> },

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

      // optional placeholders for dashboard links (avoid 404 if used)
      { path: "payments", element: <PaymentsPage /> },
      { path: "earnings", element: <EarningsPage /> },
      { path: "contracts", element: <ContractsPage /> },
      { path: "contracts/:id", element: <ContractWorkspacePage /> },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="account" replace /> },
          { path: "account", element: <AccountSettings /> },
          { path: "security", element: <SecuritySettings /> },
          { path: "notifications", element: <NotificationsSettings /> },
          { path: "privacy", element: <PrivacySettings /> },
          { path: "connections", element: <ConnectedAccountsSettings /> },
          { path: "activity", element: <ActivityLogSettings /> },
        ],
      },
     
    ],
  },
]);