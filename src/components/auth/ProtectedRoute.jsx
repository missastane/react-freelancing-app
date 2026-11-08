import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    // Wait until the authentication process is completed
    if (isInitializing) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Allow access to protected routes
    return <Outlet />;
}