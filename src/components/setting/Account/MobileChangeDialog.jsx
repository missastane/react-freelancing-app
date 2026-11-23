
import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import {
    requestMobileChangeSchema,
    confirmMobileChangeSchema,
} from "../../../schemas/profile/mobile-change.schema";

import BaseDialog from "../../common/BaseDialog";

import {
    useRequestMobileChange,
    useConfirmMobileChange,
} from "../../../hooks/profile/useMobileChange";

import { useNotification } from "../../../hooks/useNotification";

const mobileDefaultValues = {
    id: "",
};

const otpDefaultValues = {
    otp: "",
};

const OTP_EXPIRY_SECONDS = 120;

export default function MobileChangeDialog({ open, onClose }) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [step, setStep] = useState("mobile");
    const [mobile, setMobile] = useState("");
    const [token, setToken] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [serverError, setServerError] = useState("");

    const requestMutation = useRequestMobileChange();
    const confirmMutation = useConfirmMobileChange();

    const isPending =
        requestMutation.isPending || confirmMutation.isPending;

    const mobileForm = useForm({
        resolver: zodResolver(requestMobileChangeSchema(t)),
        defaultValues: mobileDefaultValues,
    });

    const otpForm = useForm({
        resolver: zodResolver(confirmMobileChangeSchema(t)),
        defaultValues: otpDefaultValues,
    });

    useEffect(() => {
        if (open) {
            setStep("mobile");
            setMobile("");
            setToken(null);
            setSecondsLeft(0);
            setServerError("");

            mobileForm.reset(mobileDefaultValues);
            otpForm.reset(otpDefaultValues);

            requestMutation.reset();
            confirmMutation.reset();
        }
    }, [open]);

    useEffect(() => {
        if (!open || step !== "otp" || secondsLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((previous) => Math.max(previous - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [open, step, secondsLeft]);

    const handleClose = () => {
        if (isPending) return;

        setStep("mobile");
        setMobile("");
        setToken(null);
        setSecondsLeft(0);
        setServerError("");

        mobileForm.reset(mobileDefaultValues);
        otpForm.reset(otpDefaultValues);

        requestMutation.reset();
        confirmMutation.reset();

        onClose();
    };

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error_list?.[0] ||
            t("common.generalError")
        );
    };

    const handleRequestMobile = async (values) => {
        setServerError("");
        requestMutation.reset();

        try {
            const response = await requestMutation.mutateAsync(values.id);

            setMobile(values.id);
            setToken(response.data.token);
            setSecondsLeft(OTP_EXPIRY_SECONDS);
            setStep("otp");

            otpForm.reset(otpDefaultValues);

            showNotification(response.message, "success");
        } catch (error) {
            const validationErrors = error?.response?.data?.errors;

            if (error?.response?.status === 422 && validationErrors?.id?.length) {
                mobileForm.setError("id", {
                    type: "server",
                    message: validationErrors.id[0],
                });
            }

            setServerError(getErrorMessage(error));
        }
    };

    const handleResendOtp = async () => {
        if (secondsLeft > 0 || isPending) return;

        setServerError("");
        requestMutation.reset();

        try {
            const response = await requestMutation.mutateAsync(mobile);

            setToken(response.data.token);
            setSecondsLeft(OTP_EXPIRY_SECONDS);
            otpForm.reset(otpDefaultValues);

            showNotification(response.message, "success");
        } catch (error) {
            setServerError(getErrorMessage(error));
        }
    };

    const handleConfirmMobile = async (values) => {
        setServerError("");
        confirmMutation.reset();

        try {
            const response = await confirmMutation.mutateAsync({
                token,
                otp: values.otp,
            });

            showNotification(response.message, "success");
            handleClose();
        } catch (error) {
            const validationErrors = error?.response?.data?.errors;

            if (error?.response?.status === 422 && validationErrors?.otp?.length) {
                otpForm.setError("otp", {
                    type: "server",
                    message: validationErrors.otp[0],
                });
            }

            setServerError(getErrorMessage(error));
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("profile.mobileChange.title")}
            subtitle={
                step === "mobile"
                    ? t("profile.mobileChange.subtitle")
                    : t("profile.mobileChange.otpSubtitle", { mobile })
            }
            maxWidth="sm"
            showCloseButton
            closeButtonDisabled={isPending}
            contentSx={{
                pt: 2,
                pb: 3,
            }}
            actions={
                <>
                    <Button
                        onClick={handleClose}
                        color="inherit"
                        disabled={isPending}
                    >
                        {t("common.cancel")}
                    </Button>

                    {step === "mobile" ? (
                        <Button
                            type="submit"
                            form="mobile-change-form"
                            variant="contained"
                            disabled={isPending}
                            startIcon={
                                isPending ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : null
                            }
                        >
                            {isPending
                                ? t("profile.mobileChange.submitting")
                                : t("profile.mobileChange.submit")}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            form="mobile-confirm-form"
                            variant="contained"
                            disabled={isPending}
                            startIcon={
                                isPending ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : null
                            }
                        >
                            {isPending
                                ? t("profile.mobileChange.verifying")
                                : t("profile.mobileChange.confirm")}
                        </Button>
                    )}
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {step === "mobile" ? (
                <Stack
                    component="form"
                    id="mobile-change-form"
                    onSubmit={mobileForm.handleSubmit(handleRequestMobile)}
                    spacing={2.5}
                >
                    <TextField
                        label={t("profile.mobileChange.fields.mobile")}
                        fullWidth
                        autoFocus
                        autoComplete="tel"
                        {...mobileForm.register("id")}
                        error={!!mobileForm.formState.errors.id}
                        helperText={mobileForm.formState.errors.id?.message}
                    />

                    {serverError && (
                        <Alert severity="error">{serverError}</Alert>
                    )}
                </Stack>
            ) : (
                <Stack
                    component="form"
                    id="mobile-confirm-form"
                    onSubmit={otpForm.handleSubmit(handleConfirmMobile)}
                    spacing={2.5}
                >
                    <TextField
                        label={t("profile.mobileChange.fields.otp")}
                        fullWidth
                        autoFocus
                        autoComplete="one-time-code"
                        {...otpForm.register("otp")}
                        slotProps={{
                            htmlInput: {
                                maxLength: 6,
                                inputMode: "numeric",
                            },
                        }}
                        error={!!otpForm.formState.errors.otp}
                        helperText={otpForm.formState.errors.otp?.message}
                    />

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="body2" color="text.secondary">
                            {secondsLeft > 0
                                ? t("profile.mobileChange.timer", {
                                    time: formatTime(secondsLeft),
                                })
                                : t("profile.mobileChange.expired")}
                        </Typography>

                        <Button
                            size="small"
                            onClick={handleResendOtp}
                            disabled={secondsLeft > 0 || isPending}
                        >
                            {t("profile.mobileChange.resend")}
                        </Button>
                    </Stack>

                    {serverError && (
                        <Alert severity="error">{serverError}</Alert>
                    )}
                </Stack>
            )}
        </BaseDialog>
    );
}
