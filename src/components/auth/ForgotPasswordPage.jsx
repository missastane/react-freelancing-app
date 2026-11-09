
import React, { useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";

import AuthLayout from "./AuthLayout";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createForgotPasswordSchema } from "../../schemas/auth/forgotPasswordSchema";

export default function ForgotPasswordPage() {
    const [requestStatus, setRequestStatus] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    const { t } = useTranslation();
    const forgotPasswordSchema = useMemo(
        () => createForgotPasswordSchema(t),
        [t]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const {
        mutate: sendRecoveryLink,
        isPending,
    } = useForgotPassword();

    const onSubmit = ({ email }) => {
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
                        t("auth.forgotPassword.rateLimited")
                    );
                } else {
                    setRequestStatus("error");
                    setRequestMessage(
                        errorList?.join("\n") ||
                        t("auth.forgotPassword.generalError")
                    );
                }
            },
        });
    };

    return (
        <AuthLayout
            title={t("auth.forgotPassword.pageTitle")}
            subtitle={t("auth.forgotPassword.pageSubtitle")}
        >
            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }} component="form"
                onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>
                            {t("auth.forgotPassword.title")}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {t("auth.forgotPassword.description")}
                        </Typography>
                    </Box>

                    {requestStatus === "success" && (
                        <Alert severity="success">
                            {t("auth.forgotPassword.success")}
                        </Alert>
                    )}

                    {requestStatus === "success" && (
                        <Box textAlign="center">
                            <Typography variant="body2" fontWeight={600}>
                                {t("auth.forgotPassword.didNotReceive")}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                {t("auth.forgotPassword.checkSpam")}
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
                        {...register("email")}
                        fullWidth
                        label={t("common.emailAddress")}
                        type="email"
                        autoComplete="email"
                        disabled={isPending}
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isPending}
                    >
                        {isPending
                            ? t("auth.forgotPassword.sending")
                            : requestStatus === "success"
                                ? t("auth.forgotPassword.resend")
                                : t("auth.forgotPassword.submit")}
                    </Button>

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
                </Stack>
            </Box>
        </AuthLayout>
    );
}
