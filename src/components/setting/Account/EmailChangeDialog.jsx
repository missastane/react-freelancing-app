
import { useEffect } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { requestEmailChangeSchema } from "../../../schemas/profile/email-change.schema";
import BaseDialog from "../../common/BaseDialog";
import { useRequestEmailChange } from "../../../hooks/profile/useRequestEmailChange";
import { useNotification } from "../../../hooks/useNotification";
const defaultValues = {
    email: "",
    current_password: "",
};

export default function EmailChangeDialog({ open, onClose }) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        mutateAsync,
        isPending,
        error,
        reset: resetMutation,
    } = useRequestEmailChange();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requestEmailChangeSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
            resetMutation();
        }
    }, [open, reset, resetMutation]);

    const handleClose = () => {
        if (isPending) return;

        reset(defaultValues);
        resetMutation();
        onClose();
    };

    const onSubmit = async (values) => {
        resetMutation();

        try {
            const response = await mutateAsync(values);

            showNotification(response.message, "success");

            reset(defaultValues);
            onClose();

        } catch (err) {
            const validationErrors = err?.response?.data?.errors;

            if (err?.response?.status === 422 && validationErrors) {
                Object.entries(validationErrors).forEach(
                    ([field, messages]) => {
                        setError(field, {
                            type: "server",
                            message: messages?.[0],
                        });
                    }
                );

                showNotification(
                    err?.response?.data?.message ||
                        t("common.generalError"),
                    "error"
                );
            }
        }
    };

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("profile.emailChange.title")}
            subtitle={t("profile.emailChange.subtitle")}
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

                    <Button
                        type="submit"
                        form="email-change-form"
                        variant="contained"
                        disabled={isPending}
                        startIcon={
                            isPending ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : null
                        }
                    >
                        {isPending
                            ? t("profile.emailChange.submitting")
                            : t("profile.emailChange.submit")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            <Stack
                component="form"
                id="email-change-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={2.5}
            >
                <TextField
                    label={t("profile.emailChange.fields.email")}
                    type="email"
                    fullWidth
                    autoFocus
                    autoComplete="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label={t("profile.emailChange.fields.currentPassword")}
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    {...register("current_password")}
                    error={!!errors.current_password}
                    helperText={errors.current_password?.message}
                />

                {error && error?.response?.status !== 422 && (
                    <Alert severity="error">
                        {error?.response?.data?.message ||
                            t("common.generalError")}
                    </Alert>
                )}
            </Stack>
        </BaseDialog>
    );
}
