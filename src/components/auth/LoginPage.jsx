
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
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
import { useLogin } from "../../hooks/auth/useLogin";
import { useAuth } from "../../context/AuthContext";
import { createLoginSchema } from "../../schemas/auth/loginSchema";

export default function LoginPage() {
    const [show, setShow] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const loginSchema = useMemo(
        () => createLoginSchema(t),
        [t]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        isAuthenticated,
        isInitializing,
        startAuth,
    } = useAuth();

    const {
        mutate,
        isPending,
        isError,
        error,
    } = useLogin();

    useEffect(() => {
        if (isAuthenticated && !isInitializing) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, isInitializing, navigate]);

    const onSubmit = (values) => {
        mutate(
            {
                email: values.email.trim(),
                password: values.password,
                client_type: "web",
                remember_me: rememberMe,
            },
            {
                onSuccess: (response) => {
                    const accessToken = response?.data?.access_token;

                    if (!accessToken) {
                        return;
                    }

                    startAuth(accessToken);
                },
            }
        );
    };

    const errorMessage =
        error?.response?.data?.message ||
        t("auth.login.generalError");

    return (
        <AuthLayout
            title={t("auth.login.pageTitle")}
            subtitle={t("auth.login.pageSubtitle")}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.2}>
                    <TextField
                        {...register("email")}
                        label={t("common.emailAddress")}
                        type="email"
                        placeholder="example@email.com"
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
                        {...register("password")}
                        label={t("common.password")}
                        type={show ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        autoComplete="current-password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShow((s) => !s)}
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

                    {isError && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={rememberMe}
                                    onChange={(event) => setRememberMe(event.target.checked)}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    {t("auth.login.rememberMe")}
                                </Typography>
                            }
                        />

                        <Link
                            component={RouterLink}
                            to="/auth/forgot-password"
                            underline="hover"
                            sx={{ fontSize: 13 }}
                        >
                            {t("auth.login.forgotPassword")}
                        </Link>
                    </Box>

                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        sx={{ py: 1.2 }}
                        disabled={isPending || isInitializing}
                    >
                        {isPending || isInitializing
                            ? t("auth.login.signingIn")
                            : t("auth.login.submit")}
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
                        onClick={() => console.log("google sign-in placeholder")}
                    >
                        {t("auth.login.googleSignIn")}
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 1 }}
                    >
                        {t("auth.login.noAccount")}{" "}
                        <Link
                            component={RouterLink}
                            to="/auth/register"
                            underline="hover"
                        >
                            {t("auth.login.createAccount")}
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </AuthLayout>
    );
}
