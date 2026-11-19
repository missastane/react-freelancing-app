
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

import { updateAdminProvinceSchema } from "../../../../schemas/admin/admin-province.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useAdminProvince } from "../../../../hooks/admin/province/useAdminProvince";
import { useUpdateAdminProvince } from "../../../../hooks/admin/province/useUpdateAdminProvince";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function UpdateProvinceDialog({
    open,
    provinceId,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        data: provinceResponse,
        isLoading: isProvinceLoading,
        isError: isProvinceError,
        error: provinceError,
        refetch,
    } = useAdminProvince(open ? provinceId : null);

    const province = provinceResponse?.data?.data ??
        provinceResponse?.data ??
        provinceResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminProvince();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminProvinceSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && province) {
            reset({
                name: province.name ?? "",
            });

            resetMutation();
        }
    }, [open, province, reset, resetMutation]);

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
            title={t("admin.provinces.update.title")}
            subtitle={t("admin.provinces.update.subtitle")}
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
                        form="update-province-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isProvinceLoading ||
                            isProvinceError ||
                            !province
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
                            ? t("admin.provinces.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isProvinceLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isProvinceError ? (
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
                    {provinceError?.response?.data?.message ||
                        t("admin.provinces.update.loadError")}
                </Alert>
            ) : province ? (
                <Stack
                    component="form"
                    id="update-province-form"
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
                                t("admin.provinces.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );
}
