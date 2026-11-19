
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

import { createAdminCitySchema } from "../../../../schemas/admin/admin-city.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useCreateAdminCity } from "../../../../hooks/admin/city/useCreateAdminCity";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function CreateCityDialog({
    open,
    provinceId,
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
    } = useCreateAdminCity();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createAdminCitySchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
            resetMutation();
        }
    }, [open, provinceId, reset, resetMutation]);

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
                provinceId,
                data: values,
            });

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
            title={t("admin.cities.create.title")}
            subtitle={t("admin.cities.create.subtitle")}
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
                        form="create-city-form"
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
                            ? t("admin.cities.create.creating")
                            : t("admin.cities.create.submit")}
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
                id="create-city-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={2.5}
            >
                <TextField
                    label={t("admin.cities.fields.name")}
                    fullWidth
                    autoFocus
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                {isError && (
                    <Alert severity="error">
                        {error?.response?.data?.message ||
                            t("admin.cities.create.error")}
                    </Alert>
                )}
            </Stack>
        </BaseDialog>
    );
}
