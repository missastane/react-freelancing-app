
import React from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    Alert,
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import AuthLayout from "./AuthLayout";

export default function EmailChangeVerifiedPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");

    const verificationStates = {
        success: {
            title: t("auth.emailChangeVerification.states.success.title"),
            message: t("auth.emailChangeVerification.states.success.message"),
            severity: "success",
            icon: (
                <CheckCircleOutlineIcon
                    sx={{ fontSize: 64, color: "success.main" }}
                />
            ),
        },

        expired: {
            title: t("auth.emailChangeVerification.states.expired.title"),
            message: t("auth.emailChangeVerification.states.expired.message"),
            severity: "warning",
            icon: (
                <InfoOutlinedIcon
                    sx={{ fontSize: 64, color: "warning.main" }}
                />
            ),
        },

        email_taken: {
            title: t("auth.emailChangeVerification.states.emailTaken.title"),
            message: t("auth.emailChangeVerification.states.emailTaken.message"),
            severity: "error",
            icon: (
                <ErrorOutlineIcon
                    sx={{ fontSize: 64, color: "error.main" }}
                />
            ),
        },

        failed: {
            title: t("auth.emailChangeVerification.states.failed.title"),
            message: t("auth.emailChangeVerification.states.failed.message"),
            severity: "error",
            icon: (
                <ErrorOutlineIcon
                    sx={{ fontSize: 64, color: "error.main" }}
                />
            ),
        },
    };

    const currentState =
        verificationStates[status] || verificationStates.failed;

    return (
        <AuthLayout
            title={currentState.title}
            subtitle={t("auth.emailChangeVerification.subtitle")}
        >
            <Stack spacing={3} alignItems="center">
                <Box sx={{ py: 2 }}>
                    {currentState.icon}
                </Box>

                <Alert
                    severity={currentState.severity}
                    sx={{ width: "100%" }}
                >
                    {currentState.message}
                </Alert>

                <Button
                    component={RouterLink}
                    to="/settings/account/overview"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.2 }}
                >
                    {t("auth.emailChangeVerification.backToAccount")}
                </Button>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                >
                    {t("auth.emailChangeVerification.footer")}
                </Typography>
            </Stack>
        </AuthLayout>
    );
}
