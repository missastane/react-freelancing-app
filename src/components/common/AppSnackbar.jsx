import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function AppSnackbar() {
    const { loginMessage, setLoginMessage } = useAuth();

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setLoginMessage(null);
    };

    return (
        <Snackbar
            open={Boolean(loginMessage)}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                elevation={6}
                sx={{ width: "100%" }}
            >
                {loginMessage}
            </Alert>
        </Snackbar>
    );
}