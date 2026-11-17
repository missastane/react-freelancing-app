
import React, { useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { updateAdminSchema } from "../../../../schemas/admin/admin-user.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useUpdateAdminUser } from "../../../../hooks/admin/admin-user/useUpdateAdminUser";
import { useAdminUser } from "../../../../hooks/admin/admin-user/useAdminUser";
import { useNotification } from "../../../../hooks/useNotification";
const defaultValues = {
    first_name: "",
    last_name: "",
    activation: 1,
};

export default function UpdateAdminDialog({
    open,
    adminId,
    onClose,
    onSuccess,
}) {
    const { t } = useTranslation();

    const {
        data: adminResponse,
        isLoading: isAdminLoading,
        isError: isAdminError,
        error: adminError,
        refetch,
    } = useAdminUser(open ? adminId : null);

    const admin = adminResponse?.data?.data ??
        adminResponse?.data ??
        adminResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminUser();

    const { showNotification } = useNotification();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && admin) {
            reset({
                first_name: admin.first_name ?? "",
                last_name: admin.last_name ?? "",
                activation: Number(admin.activation),
            });

            resetMutation();
        }
    }, [open, admin, reset, resetMutation]);

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
                adminId,
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
                    err?.response?.data?.message || t("common.generalError"),
                    "error"
                );
            }
        }
    };

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("admin.users.update.title")}
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
                        form="update-admin-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isAdminLoading ||
                            isAdminError ||
                            !admin
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
                            ? t("admin.users.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isAdminLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isAdminError ? (
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
                    {adminError?.response?.data?.message ||
                        t("admin.users.update.loadError")}
                </Alert>
            ) : admin ? (
                <Stack
                    component="form"
                    id="update-admin-form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2.5}
                >
                    <TextField
                        label={t("admin.users.fields.firstName")}
                        fullWidth
                        {...register("first_name")}
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                    />

                    <TextField
                        label={t("admin.users.fields.lastName")}
                        fullWidth
                        {...register("last_name")}
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                    />

                    <Controller
                        name="activation"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label={t("admin.users.details.activation")}
                                error={!!errors.activation}
                                helperText={errors.activation?.message}
                            >
                                <MenuItem value={1}>
                                    {t("admin.users.status.active")}
                                </MenuItem>

                                <MenuItem value={2}>
                                    {t("admin.users.status.inactive")}
                                </MenuItem>
                            </TextField>
                        )}
                    />

                    {isError && (
                        <Alert severity="error">
                            {error?.response?.data?.message ||
                                t("admin.users.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );

}
