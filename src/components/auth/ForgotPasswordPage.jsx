import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [requestStatus, setRequestStatus] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    const {
        mutate: sendRecoveryLink,
        isPending,
        isSuccess,
        isError,
    } = useForgotPassword();

    const handleSubmit = () => {
        sendRecoveryLink(email.trim(), {
            onSuccess: () => {
                setRequestStatus("success");
                setRequestMessage("");
            },
            onError: (error) => {
                const errorList = error?.response?.data?.error_list;

                if (error?.response?.status === 429) {
                    setRequestStatus("rateLimited");
                    setRequestMessage(
                        errorList?.join("\n") ||
                        "Please wait before requesting another recovery link."
                    );
                } else {
                    setRequestStatus("error");
                    setRequestMessage(
                        errorList?.join("\n") ||
                        "Something went wrong. Please try again later."
                    );
                }
            },
        });
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="No worries! Enter your email address and we'll send you a password recovery link."
        >
            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>
                            Reset your password
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Enter the email address associated with your account.
                        </Typography>
                    </Box>

                    {requestStatus === "success" && (
                        <Alert severity="success">
                            If an account exists with this email address, a password
                            recovery link will be sent.
                        </Alert>
                    )}

                    {isSuccess && (
                        <Box textAlign="center">
                            <Typography variant="body2" fontWeight={600}>
                                Didn't receive the email?
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                Check your spam folder or try requesting another link.
                            </Typography>
                        </Box>
                    )}

                    {requestStatus === "rateLimited" && (
                        <Alert severity="warning">
                            {requestMessage}
                        </Alert>
                    )}
                    {requestStatus === "error" && (
                        <Alert severity="error">
                            {requestMessage}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setRequestStatus(null);
                            setRequestMessage("");
                        }}
                        autoComplete="email"
                        disabled={isPending}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!email.trim() || isPending}
                        onClick={handleSubmit}
                    >
                        {isPending
                            ? "Sending..."
                            : requestStatus === "success"
                                ? "Resend Recovery Link"
                                : "Send Recovery Link"}
                    </Button>



                    <Box textAlign="center">
                        <Link
                            component={RouterLink}
                            to="/auth/login"
                            underline="hover"
                            fontWeight={600}
                        >
                            Back to Login
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </AuthLayout>
    );
}