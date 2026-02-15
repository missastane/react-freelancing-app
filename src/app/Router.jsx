import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import LoginPage from "../components/pages/auth/LoginPage";
import RegisterPage from "../components/pages/auth/RegisterPage";
const Placeholder = ({ title }) => (
    <div style={{ padding: 20 }}>{title}</div>
);

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />
            },
            {
                path: "/auth",
                children: [
                    { path: "login", element: <LoginPage /> },
                    { path: "register", element: <RegisterPage /> },
                ],
            },
            { path: "dashboard", element: <Placeholder title="Dashboard" /> },
            { path: "jobs", element: <Placeholder title="Browse Jobs" /> },
            { path: "proposals", element: <Placeholder title="My Proposals" /> },
            { path: "messages", element: <Placeholder title="Messages" /> },
            { path: "settings", element: <Placeholder title="Settings" /> },
        ],
    },
]);
