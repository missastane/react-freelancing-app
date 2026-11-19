
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

import { createAdminProvinceSchema } from "../../../../schemas/admin/admin-province.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useCreateAdminProvince } from "../../../../hooks/admin/province/useCreateAdminProvince";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function CreateProvinceDialog({
    open,
    onClose,
    onSuccess,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useCreateAdminProvince();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createAdminProvinceSchema(t)),
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

    const handleSuccessClose = () => {
        reset(defaultValues);
        resetMutation();
        onClose();
    };

    const onSubmit = async (values) => {
        resetMutation();

        try {
            const response = await mutateAsync(values);

            showNotification(response.message, "success");

            handleSuccessClose();
            onSuccess?.(response);
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
            title={t("admin.provinces.create.title")}
            subtitle={t("admin.provinces.create.subtitle")}
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
                        form="create-province-form"
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
                            ? t("admin.provinces.create.creating")
                            : t("admin.provinces.create.submit")}
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
                id="create-province-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={2.5}
            >
                <TextField
                    label={t("admin.provinces.fields.name")}
                    fullWidth
                    autoFocus
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                {isError && (
                    <Alert severity="error">
                        {error?.response?.data?.message ||
                            t("admin.provinces.create.error")}
                    </Alert>
                )}
            </Stack>
        </BaseDialog>
    );
}
