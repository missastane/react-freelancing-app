import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { useLocation, Link as RouterLink } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useResendVerificationEmail } from "../../hooks/auth/useResendVerificationEmail";

export default function VerifyEmailPage() {
    const location = useLocation();

    const [email, setEmail] = useState(
        location.state?.email || ""
    );

    const resendMutation = useResendVerificationEmail();

    const handleResend = (e) => {
        e.preventDefault();

        resendMutation.mutate(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

        if (resendMutation.isSuccess || resendMutation.isError) {
            resendMutation.reset();
        }
    };

    const errorMessage =
        resendMutation.error?.response?.data?.message ||
        "Something went wrong. Please try again.";

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Please verify your email address to activate your account."
        >
            <Stack spacing={3}>
                <Box sx={{ textAlign: "center", py: 1 }}>
                    <EmailOutlinedIcon
                        sx={{
                            fontSize: 64,
                            color: "primary.main",
                        }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                >
                    We've sent a verification link to your email address.
                    Please check your inbox and click the link to verify
                    your account.
                </Typography>

                {resendMutation.isSuccess && (
                    <Alert severity="success">
                        {resendMutation.data?.message ||
                            "Verification email sent successfully."}
                    </Alert>
                )}

                {resendMutation.isError && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                    >
                        Didn't receive the email?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Check your spam folder first. If you still can't
                        find it, enter your email below and request a new
                        verification link.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleResend}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            fullWidth
                            autoComplete="email"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={
                                resendMutation.isPending ||
                                !email.trim()
                            }
                        >
                            {resendMutation.isPending
                                ? "Sending..."
                                : "Resend verification email"}
                        </Button>
                    </Stack>
                </Box>

                <Button
                    component={RouterLink}
                    to="/auth/login"
                    variant="text"
                    fullWidth
                >
                    Back to Login
                </Button>
            </Stack>
        </AuthLayout>
    );
}