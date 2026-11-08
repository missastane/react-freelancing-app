
import React from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";

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
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  const verificationStates = {
    success: {
      title: "Email Verified!",
      message: "Your email address has been successfully verified. You can now sign in to your account.",
      severity: "success",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main" }} />,
    },

    already_verified: {
      title: "Already Verified",
      message: "Your email address has already been verified. You can sign in to your account.",
      severity: "info",
      icon: <InfoOutlinedIcon sx={{ fontSize: 64, color: "info.main" }} />,
    },

    failed: {
      title: "Verification Failed",
      message: "This verification link is invalid or has expired. Please request a new verification email.",
      severity: "error",
      icon: <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />,
    },
  };

  const currentState =
    verificationStates[status] || verificationStates.failed;

  return (
    <AuthLayout
      title={currentState.title}
      subtitle="Email verification"
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
          to="/auth/login"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.2 }}
        >
          Go to Login
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          Thank you for joining our platform.
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
