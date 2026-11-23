
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

export default function EmailVerifiedPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  const verificationStates = {
    success: {
      title: t("auth.emailVerification.states.success.title"),
      message: t("auth.emailVerification.states.success.message"),
      severity: "success",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main" }} />,
    },

    already_verified: {
      title: t("auth.emailVerification.states.alreadyVerified.title"),
      message: t("auth.emailVerification.states.alreadyVerified.message"),
      severity: "info",
      icon: <InfoOutlinedIcon sx={{ fontSize: 64, color: "info.main" }} />,
    },

    failed: {
      title: t("auth.emailVerification.states.failed.title"),
      message: t("auth.emailVerification.states.failed.message"),
      severity: "error",
      icon: <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />,
    },
  };

  const currentState =
    verificationStates[status] || verificationStates.failed;

  return (
    <AuthLayout
      title={currentState.title}
      subtitle={t("auth.emailVerification.subtitle")}
    >
      <Stack spacing={3} alignItems="center">
        <Box sx={{ py: 2 }}>
          {currentState.icon}
        </Box>

        <Alert severity={currentState.severity} sx={{ width: "100%" }}>
          {currentState.message}
        </Alert>

        <Button
          component={RouterLink}
          to="/auth/login"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.2 }}
        >
          {t("auth.emailVerification.goToLogin")}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          {t("auth.emailVerification.footer")}
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
