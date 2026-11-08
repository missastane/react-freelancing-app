import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
    const { user } = useAuth();

    const hasAccess = allowedRoles.includes(user?.active_role);

    if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}