import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import LoginPage from "../components/pages/auth/LoginPage";
import RegisterPage from "../components/pages/auth/RegisterPage";
import ProjectsPage from "../components/projects/ProjectsPage";
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
    { path: "proposals", element: <Placeholder title="My Proposals" /> },

    // employer
    { path: "my-projects", element: <Placeholder title="My Projects" /> },
    { path: "my-projects/:id/proposals", element: <Placeholder title="Project Proposals" /> },

    { path: "messages", element: <Placeholder title="Messages" /> },
    { path: "settings", element: <Placeholder title="Settings" /> },
  ],
}
]);

