
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SessionRecoveryPage from "./SessionRecoveryPage";

export default function ProtectedRoute() {
    const {
        isAuthenticated,
        isInitializing,
        bootstrapError,
    } = useAuth();

    const location = useLocation();

    // Show the recovery page when session restoration fails temporarily.
    if (bootstrapError && !isAuthenticated) {
        return <SessionRecoveryPage />;
    }

    // Wait until the authentication process is completed.
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

    // Redirect unauthenticated users to login.
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}
