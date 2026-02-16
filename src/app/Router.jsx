import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import LoginPage from "../components/pages/auth/LoginPage";
import RegisterPage from "../components/pages/auth/RegisterPage";
import ProjectsPage from "../components/projects/freelancer/ProjectsPage";
import MyProjectsPage from "../components/projects/employer/MyProjectsPage";
import MessagesPage from "../components/messages/MessagesPage";
import ProjectDetailsPage from "../components/projects/ProjectDetailsPage";
import ProposalsPage from "../components/proposals/ProposalsPage";
import ProposalDetailsPage from "../components/proposals/ProposalDetailsPage";
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
      { path: "dashboard", element: <Placeholder title="Dashboard" /> },

      // freelancer
      { path: "projects", element: <ProjectsPage /> },
      { path: "proposals", element: <ProposalsPage /> },
      {
        path: "/proposals/:id/:slug",
        element: <ProposalDetailsPage />,
      },


      // employer
      { path: "my-projects", element: <MyProjectsPage /> },
      { path: "my-projects/:id/proposals", element: <Placeholder title="Project Proposals" /> },
      { path: "projects/:id/:slug", element: <ProjectDetailsPage /> },

      { path: "messages", element: <MessagesPage /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  }
]);

