
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
import { useTranslation } from "react-i18next";

import AuthLayout from "./AuthLayout";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { createResetPasswordSchema } from "../../schemas/auth/resetPasswordSchema";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const resetPasswordSchema = createResetPasswordSchema(t);

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
                        t("auth.resetPassword.success")
                    );
                },
                onError: (error) => {
                    const errorList = error?.response?.data?.error_list;

                    setRequestStatus("error");
                    setRequestMessage(
                        errorList?.join("\n") ||
                        error?.response?.data?.message ||
                        t("auth.resetPassword.generalError")
                    );
                }
            }
        );
    };

    return (
        <AuthLayout
            title={t("auth.resetPassword.pageTitle")}
            subtitle={t("auth.resetPassword.pageSubtitle")}
        >
            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>
                            {t("auth.resetPassword.title")}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {t("auth.resetPassword.description")}
                        </Typography>
                    </Box>

                    {!hasValidParams && (
                        <Alert severity="error">
                            {t("auth.resetPassword.invalidLink")}
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
                                {t("auth.resetPassword.goToLogin")}
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
                                    label={t("common.password")}
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
                                                        onClick={() =>
                                                            setShowPassword((prev) => !prev)
                                                        }
                                                        edge="end"
                                                        type="button"
                                                        disabled={isPending}
                                                        aria-label={
                                                            showPassword
                                                                ? t("common.hidePassword")
                                                                : t("common.showPassword")
                                                        }
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
                                    label={t("auth.resetPassword.confirmPassword")}
                                    type={
                                        showPasswordConfirmation
                                            ? "text"
                                            : "password"
                                    }
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
                                                                ? t("common.hidePassword")
                                                                : t("common.showPassword")
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
                                        ? t("auth.resetPassword.resetting")
                                        : t("auth.resetPassword.submit")}
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
                                {t("common.backToLogin")}
                            </Link>
                        </Box>
                    )}
                </Stack>
            </Box>
        </AuthLayout>
    );
}
