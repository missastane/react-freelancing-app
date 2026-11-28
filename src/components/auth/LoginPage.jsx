
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
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "./AuthLayout";
import { useLogin } from "../../hooks/auth/useLogin";
import { useVerifyTwoFactorLogin } from "../../hooks/auth/useVerifyTwoFactorLogin";
import { useAuth } from "../../context/AuthContext";

import { createLoginSchema } from "../../schemas/auth/loginSchema";
import { createTwoFactorLoginSchema } from "../../schemas/auth/twoFactorLoginSchema";

export default function LoginPage() {
    const [show, setShow] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [challengeToken, setChallengeToken] = useState(null);
    const [verificationMethod, setVerificationMethod] = useState("authenticator");
    const [loginFlowError, setLoginFlowError] = useState(null);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const loginSchema = useMemo(
        () => createLoginSchema(t),
        [t]
    );

    const twoFactorSchema = useMemo(
        () => createTwoFactorLoginSchema(t, verificationMethod),
        [t, verificationMethod]
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
        register: registerTwoFactor,
        handleSubmit: handleTwoFactorSubmit,
        reset: resetTwoFactorForm,
        formState: { errors: twoFactorErrors },
    } = useForm({
        resolver: zodResolver(twoFactorSchema),
        mode: "onChange",
        defaultValues: {
            code: "",
        },
    });

    const {
        isAuthenticated,
        isInitializing,
        startAuth,
    } = useAuth();

    const loginMutation = useLogin();

    const verifyMutation = useVerifyTwoFactorLogin();

    useEffect(() => {
        if (isAuthenticated && !isInitializing) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, isInitializing, navigate]);

    const onSubmit = (values) => {
        setLoginFlowError(null);

        loginMutation.mutate(
            {
                email: values.email.trim(),
                password: values.password,
                client_type: "web",
                remember_me: rememberMe,
            },
            {
                onSuccess: (response) => {
                    const data = response?.data;

                    if (data?.access_token) {
                        startAuth(data.access_token);
                        return;
                    }

                    if (
                        data?.requires_two_factor === true &&
                        data?.challenge_token
                    ) {
                        setChallengeToken(data.challenge_token);
                        resetTwoFactorForm();
                        verifyMutation.reset();
                        return;
                    }

                    setLoginFlowError(
                        t("auth.login.unexpectedResponse")
                    );
                },
            }
        );
    };

    const onVerifyTwoFactor = (values) => {
        verifyMutation.mutate(
            {
                challenge_token: challengeToken,
                code: values.code.trim(),
            },
            {
                onSuccess: (response) => {
                    const accessToken = response?.data?.access_token;

                    if (!accessToken) {
                        setLoginFlowError(
                            t("auth.login.unexpectedResponse")
                        );
                        return;
                    }

                    startAuth(accessToken);
                },
            }
        );
    };

    const handleVerificationMethodChange = (method) => {
        setVerificationMethod(method);
        resetTwoFactorForm();
        verifyMutation.reset();
        setLoginFlowError(null);
    };

    const handleBackToLogin = () => {
        setChallengeToken(null);
        setVerificationMethod("authenticator");
        setLoginFlowError(null);

        resetTwoFactorForm();
        verifyMutation.reset();
        loginMutation.reset();
    };

    const loginErrorMessage =
        loginMutation.error?.response?.data?.message ||
        t("auth.login.generalError");

    const verificationErrorMessage =
        verifyMutation.error?.response?.data?.message ||
        t("auth.login.twoFactor.generalError");

    return (
        <AuthLayout
            title={
                challengeToken
                    ? t("auth.login.twoFactor.title")
                    : t("auth.login.pageTitle")
            }
            subtitle={
                challengeToken
                    ? t("auth.login.twoFactor.subtitle")
                    : t("auth.login.pageSubtitle")
            }
        >
            {!challengeToken ? (
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

                        {(loginMutation.isError || loginFlowError) && (
                            <Alert severity="error">
                                {loginFlowError || loginErrorMessage}
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
                                        onChange={(event) =>
                                            setRememberMe(event.target.checked)
                                        }
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
                            disabled={
                                loginMutation.isPending ||
                                isInitializing
                            }
                        >
                            {loginMutation.isPending || isInitializing
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
                            onClick={() =>
                                console.log("google sign-in placeholder")
                            }
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
            ) : (
                <Box
                    component="form"
                    onSubmit={handleTwoFactorSubmit(onVerifyTwoFactor)}
                >
                    <Stack spacing={2.2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {verificationMethod === "authenticator"
                                ? t("auth.login.twoFactor.authenticatorDescription")
                                : t("auth.login.twoFactor.recoveryDescription")}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                            }}
                        >
                            <Button
                                fullWidth
                                variant={
                                    verificationMethod === "authenticator"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() =>
                                    handleVerificationMethodChange("authenticator")
                                }
                                type="button"
                            >
                                {t("auth.login.twoFactor.authenticator")}
                            </Button>

                            <Button
                                fullWidth
                                variant={
                                    verificationMethod === "recovery"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() =>
                                    handleVerificationMethodChange("recovery")
                                }
                                type="button"
                            >
                                {t("auth.login.twoFactor.recoveryCode")}
                            </Button>
                        </Box>

                        <TextField
                            {...registerTwoFactor("code")}
                            label={
                                verificationMethod === "authenticator"
                                    ? t("auth.login.twoFactor.authenticatorCode")
                                    : t("auth.login.twoFactor.recoveryCode")
                            }
                            placeholder={
                                verificationMethod === "authenticator"
                                    ? "000000"
                                    : "A1B2C3D4E5"
                            }
                            autoComplete="one-time-code"
                            error={!!twoFactorErrors.code}
                            helperText={twoFactorErrors.code?.message}
                            inputProps={{
                                inputMode:
                                    verificationMethod === "authenticator"
                                        ? "numeric"
                                        : "text",
                                maxLength:
                                    verificationMethod === "authenticator"
                                        ? 6
                                        : 10,
                            }}
                        />

                        {(verifyMutation.isError || loginFlowError) && (
                            <Alert severity="error">
                                {loginFlowError || verificationErrorMessage}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{ py: 1.2 }}
                            disabled={verifyMutation.isPending}
                        >
                            {verifyMutation.isPending
                                ? t("auth.login.twoFactor.verifying")
                                : t("auth.login.twoFactor.verify")}
                        </Button>

                        <Button
                            type="button"
                            variant="text"
                            startIcon={<ArrowBackOutlinedIcon />}
                            onClick={handleBackToLogin}
                        >
                            {t("auth.login.twoFactor.backToLogin")}
                        </Button>
                    </Stack>
                </Box>
            )}
        </AuthLayout>
    );
}
