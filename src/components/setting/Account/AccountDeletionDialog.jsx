
import { useEffect } from "react";

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

import { accountDeletionSchema } from "../../../schemas/profile/account-deletion.schema";
import { useRequestAccountDeletion } from "../../../hooks/profile/useAccountDeletion";
import { useNotification } from "../../../hooks/useNotification";

import BaseDialog from "../../common/BaseDialog";

const defaultValues = {
    password: "",
    reason: "",
};

export default function AccountDeletionDialog({ open, onClose }) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const requestMutation = useRequestAccountDeletion();

    const form = useForm({
        resolver: zodResolver(accountDeletionSchema(t)),
        defaultValues,
    });

    const isPending = requestMutation.isPending;

    useEffect(() => {
        if (open) {
            form.reset(defaultValues);
            requestMutation.reset();
        }
    }, [open]);

    const handleClose = () => {
        if (isPending) return;

        form.reset(defaultValues);
        requestMutation.reset();
        onClose();
    };

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error_list?.[0] ||
            t("common.generalError")
        );
    };

    const handleSubmit = async (values) => {
        requestMutation.reset();

        try {
            const response = await requestMutation.mutateAsync({
                password: values.password,
                reason: values.reason.trim() || null,
            });

            showNotification(response.message, "success");
            handleClose();
        } catch (error) {
            const validationErrors = error?.response?.data?.errors;

            if (error?.response?.status === 422 && validationErrors) {
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    if (field === "password" || field === "reason") {
                        form.setError(field, {
                            type: "server",
                            message: messages?.[0],
                        });
                    }
                });
            }
        }
    };

    const serverError = requestMutation.error
        ? getErrorMessage(requestMutation.error)
        : "";

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("settings.account.accountDeletion.dialog.title")}
            subtitle={t("settings.account.accountDeletion.dialog.subtitle")}
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
                        form="account-deletion-form"
                        variant="contained"
                        color="error"
                        disabled={isPending}
                        startIcon={
                            isPending ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : null
                        }
                    >
                        {isPending
                            ? t("settings.account.accountDeletion.dialog.submitting")
                            : t("settings.account.accountDeletion.dialog.submit")}
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
                id="account-deletion-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                spacing={2.5}
            >
                <Alert severity="warning">
                    {t("settings.account.accountDeletion.dialog.warning")}
                </Alert>

                <Typography variant="body2" color="text.secondary">
                    {t("settings.account.accountDeletion.dialog.gracePeriod")}
                </Typography>

                <TextField
                    label={t("settings.account.accountDeletion.dialog.fields.password")}
                    type="password"
                    fullWidth
                    autoFocus
                    autoComplete="current-password"
                    {...form.register("password")}
                    error={!!form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                />

                <TextField
                    label={t("settings.account.accountDeletion.dialog.fields.reason")}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    placeholder={t(
                        "settings.account.accountDeletion.dialog.fields.reasonPlaceholder"
                    )}
                    {...form.register("reason")}
                    error={!!form.formState.errors.reason}
                    helperText={
                        form.formState.errors.reason?.message ||
                        t("settings.account.accountDeletion.dialog.fields.reasonHelper")
                    }
                    slotProps={{
                        htmlInput: {
                            maxLength: 1000,
                        },
                    }}
                />

                {serverError && (
                    <Alert severity="error">{serverError}</Alert>
                )}
            </Stack>
        </BaseDialog>
    );
}
