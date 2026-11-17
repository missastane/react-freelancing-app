import React from "react";
import {
    Alert,
    Snackbar,
} from "@mui/material";

export default function GlobalSnackbar({
    notification,
    onClose,
}) {
    return (
        <Snackbar
            key={notification?.id}
            open={!!notification}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
        >
            {notification && (
                <Alert
                    onClose={onClose}
                    severity={notification.severity}
                    variant="filled"
                    elevation={6}
                    sx={{
                        width: "100%",
                        minWidth: { xs: "auto", sm: 320 },
                    }}
                >
                    {notification.message}
                </Alert>
            )}
        </Snackbar>
    );
}