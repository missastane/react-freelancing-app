import React from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SessionRecoveryPage() {
    const {
        bootstrapError,
        retryBootstrap,
        isInitializing,
    } = useAuth();

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t("auth.sessionRecovery.pageTitle")}
            subtitle={t("auth.sessionRecovery.pageSubtitle")}
        >
            <Stack spacing={3}>
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        {t("auth.sessionRecovery.heading")}
                    </Typography>

                    <Typography color="text.secondary">
                        {t("auth.sessionRecovery.description")}
                    </Typography>
                </Box>

                {bootstrapError && (
                    <Alert severity="error">
                        {bootstrapError}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    size="large"
                    onClick={retryBootstrap}
                    disabled={isInitializing}
                    startIcon={
                        isInitializing
                            ? <CircularProgress size={18} color="inherit" />
                            : null
                    }
                >
                    {isInitializing
                        ? t("auth.sessionRecovery.retrying")
                        : t("auth.sessionRecovery.tryAgain")}
                </Button>

                <Button
                    variant="text"
                    onClick={() => navigate("/auth/login", { replace: true })}
                    disabled={isInitializing}
                >
                    {t("auth.sessionRecovery.goToLogin")}
                </Button>
            </Stack>
        </AuthLayout>
    );
}