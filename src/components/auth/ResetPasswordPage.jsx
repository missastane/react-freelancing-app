import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "./AuthLayout";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { resetPasswordSchema } from "../../schemas/auth/resetPasswordSchema";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [requestStatus, setRequestStatus] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const {
        mutate: resetUserPassword,
        isPending,
    } = useResetPassword();

    const hasValidParams = Boolean(token && email);

    const onSubmit = (values) => {
        setRequestStatus(null);
        setRequestMessage("");

        resetUserPassword(
            {
                token,
                email,
                ...values,
            },
            {
                onSuccess: (response) => {
                    setRequestStatus("success");
                    setRequestMessage(
                        response?.message ||
                        "Your password has been changed successfully."
                    );
                },
                onError: (error) => {
                    const errorList = error?.response?.data?.error_list;

                    setRequestStatus("error");
                    setRequestMessage(
                        errorList?.join("\n") ||
                        error?.response?.data?.message ||
                        "Something went wrong. Please try again."
                    );
                },
            }
        );
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new password for your account."
        >
            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>
                            Create New Password
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Enter your new password below.
                        </Typography>
                    </Box>

                    {!hasValidParams && (
                        <Alert severity="error">
                            This password reset link is invalid or incomplete.
                            Please request a new recovery link.
                        </Alert>
                    )}

                    {requestStatus === "success" && (
                        <>
                            <Alert severity="success">
                                {requestMessage}
                            </Alert>

                            <Button
                                component={RouterLink}
                                to="/auth/login"
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                Go to Login
                            </Button>
                        </>
                    )}

                    {requestStatus === "error" && (
                        <Alert
                            severity="error"
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            {requestMessage}
                        </Alert>
                    )}

                    {hasValidParams && requestStatus !== "success" && (
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    {...register("password")}
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password?.message}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        edge="end"
                                                        type="button"
                                                        disabled={isPending}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword
                                                            ? <VisibilityOffOutlinedIcon />
                                                            : <VisibilityOutlinedIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <TextField
                                    {...register("password_confirmation")}
                                    fullWidth
                                    label="Confirm Password"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                    error={Boolean(errors.password_confirmation)}
                                    helperText={errors.password_confirmation?.message}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPasswordConfirmation((prev) => !prev)
                                                        }
                                                        edge="end"
                                                        type="button"
                                                        disabled={isPending}
                                                        aria-label={
                                                            showPasswordConfirmation
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        {showPasswordConfirmation
                                                            ? <VisibilityOffOutlinedIcon />
                                                            : <VisibilityOutlinedIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Resetting Password..."
                                        : "Reset Password"}
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {requestStatus !== "success" && (
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
                    )}
                </Stack>
            </Box>
        </AuthLayout>
    );
}