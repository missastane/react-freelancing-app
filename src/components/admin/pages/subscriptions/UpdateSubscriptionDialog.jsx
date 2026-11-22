import { useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { updateAdminSubscriptionSchema } from "../../../../schemas/admin/admin-subscription.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useAdminSubscription } from "../../../../hooks/admin/subscription/useAdminSubscription";
import { useUpdateAdminSubscription } from "../../../../hooks/admin/subscription/useUpdateAdminSubscription";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function UpdateSubscriptionDialog({
    open,
    subscriptionId,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        data: subscriptionResponse,
        isLoading: isSubscriptionLoading,
        isError: isSubscriptionError,
        error: subscriptionError,
        refetch,
    } = useAdminSubscription(open ? subscriptionId : null);

    const subscription =
        subscriptionResponse?.data?.data ??
        subscriptionResponse?.data ??
        subscriptionResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminSubscription();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminSubscriptionSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && subscription) {
            reset({
                name: subscription.name ?? "",
            });

            resetMutation();
        }
    }, [open, subscription, reset, resetMutation]);

    const handleClose = () => {
        if (isPending) return;

        reset(defaultValues);
        resetMutation();
        onClose();
    };

    const handleSuccessClose = () => {
        reset(defaultValues);
        resetMutation();
        onClose();
    };

    const onSubmit = async (values) => {
        resetMutation();

        try {
            const response = await mutateAsync({
                subscriptionId,
                data: values,
            });

            showNotification(response.message, "success");
            handleSuccessClose();
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
            title={t("admin.subscriptions.update.title")}
            subtitle={t("admin.subscriptions.update.subtitle")}
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
                        form="update-subscription-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isSubscriptionLoading ||
                            isSubscriptionError ||
                            !subscription
                        }
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
                            ? t("admin.subscriptions.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isSubscriptionLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isSubscriptionError ? (
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => refetch()}
                        >
                            {t("common.retry")}
                        </Button>
                    }
                >
                    {subscriptionError?.response?.data?.message ||
                        t("admin.subscriptions.update.loadError")}
                </Alert>
            ) : subscription ? (
                <Stack
                    component="form"
                    id="update-subscription-form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2.5}
                >
                    <TextField
                        label={t("admin.subscriptions.fields.name")}
                        fullWidth
                        autoFocus
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    {isError && (
                        <Alert severity="error">
                            {error?.response?.data?.message ||
                                t("admin.subscriptions.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );
}