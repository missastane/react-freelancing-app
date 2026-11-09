
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GoogleIcon from "@mui/icons-material/Google";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "./AuthLayout";
import { useRegister } from "../../hooks/auth/useRegister";
import { createRegisterSchema } from "../../schemas/auth/registerSchema";

export default function RegisterPage() {
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const registerSchema = useMemo(
        () => createRegisterSchema(t),
        [t]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            role: "2",
            password: "",
            password_confirmation: "",
        },
    });

    const registerMutation = useRegister();

    const onSubmit = (values) => {
        const payload = {
            ...values,
            email: values.email.trim(),
            role: Number(values.role),
        };

        registerMutation.mutate(payload, {
            onSuccess: () => {
                navigate("/auth/verify-email", {
                    state: {
                        email: values.email.trim(),
                    },
                });
            },
        });
    };

    const errorMessage =
        registerMutation.error?.response?.data?.message ||
        t("auth.register.generalError");

    return (
        <AuthLayout
            title={t("auth.register.pageTitle")}
            subtitle={t("auth.register.pageSubtitle")}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.2}>
                    {registerMutation.isError && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}

                    <TextField
                        {...register("email")}
                        label={t("common.emailAddress")}
                        type="email"
                        placeholder="you@example.com"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        autoComplete="email"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        select
                        {...register("role")}
                        label={t("auth.register.role")}
                        error={!!errors.role}
                        helperText={errors.role?.message}
                    >
                        <MenuItem value="2">
                            {t("auth.register.freelancer")}
                        </MenuItem>

                        <MenuItem value="1">
                            {t("auth.register.client")}
                        </MenuItem>
                    </TextField>

                    <TextField
                        {...register("password")}
                        label={t("common.password")}
                        type={show ? "text" : "password"}
                        placeholder={t("auth.register.passwordPlaceholder")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        autoComplete="new-password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShow((prev) => !prev)}
                                            edge="end"
                                            type="button"
                                            aria-label={
                                                show
                                                    ? t("common.hidePassword")
                                                    : t("common.showPassword")
                                            }
                                        >
                                            {show
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
                        label={t("auth.register.confirmPassword")}
                        type={showConfirm ? "text" : "password"}
                        placeholder={t("auth.register.confirmPasswordPlaceholder")}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation?.message}
                        autoComplete="new-password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirm((prev) => !prev)}
                                            edge="end"
                                            type="button"
                                            aria-label={
                                                showConfirm
                                                    ? t("common.hidePassword")
                                                    : t("common.showPassword")
                                            }
                                        >
                                            {showConfirm
                                                ? <VisibilityOffOutlinedIcon />
                                                : <VisibilityOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        sx={{ py: 1.2 }}
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending
                            ? t("auth.register.creatingAccount")
                            : t("auth.register.submit")}
                    </Button>

                    <Divider sx={{ my: 0.5 }}>
                        {t("common.or")}
                    </Divider>

                    <Button
                        type="button"
                        size="large"
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        sx={{ py: 1.1 }}
                        onClick={() => console.log("google sign-up placeholder")}
                    >
                        {t("auth.register.googleSignUp")}
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 1 }}
                    >
                        {t("auth.register.alreadyHaveAccount")}{" "}
                        <Link
                            component={RouterLink}
                            to="/auth/login"
                            underline="hover"
                        >
                            {t("auth.register.signIn")}
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </AuthLayout>
    );
}
