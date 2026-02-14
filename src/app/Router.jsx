import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";

const Placeholder = ({ title }) => (
  <div style={{ padding: 20 }}>{title}</div>
);

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Placeholder title="Dashboard" /> },
      { path: "jobs", element: <Placeholder title="Browse Jobs" /> },
      { path: "proposals", element: <Placeholder title="My Proposals" /> },
      { path: "messages", element: <Placeholder title="Messages" /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  },
]);
