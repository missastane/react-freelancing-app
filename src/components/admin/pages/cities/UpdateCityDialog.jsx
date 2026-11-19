
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

import { updateAdminCitySchema } from "../../../../schemas/admin/admin-city.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useAdminCity } from "../../../../hooks/admin/city/useAdminCity";
import { useUpdateAdminCity } from "../../../../hooks/admin/city/useUpdateAdminCity";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function UpdateCityDialog({
    open,
    cityId,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        data: cityResponse,
        isLoading: isCityLoading,
        isError: isCityError,
        error: cityError,
        refetch,
    } = useAdminCity(open ? cityId : null);

    const city = cityResponse?.data?.data ??
        cityResponse?.data ??
        cityResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminCity();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminCitySchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && city) {
            reset({
                name: city.name ?? "",
            });

            resetMutation();
        }
    }, [open, city, reset, resetMutation]);

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
                cityId,
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
            title={t("admin.cities.update.title")}
            subtitle={t("admin.cities.update.subtitle")}
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
                        form="update-city-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isCityLoading ||
                            isCityError ||
                            !city
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
                            ? t("admin.cities.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isCityLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isCityError ? (
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
                    {cityError?.response?.data?.message ||
                        t("admin.cities.update.loadError")}
                </Alert>
            ) : city ? (
                <Stack
                    component="form"
                    id="update-city-form"
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
                                t("admin.cities.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );
}
