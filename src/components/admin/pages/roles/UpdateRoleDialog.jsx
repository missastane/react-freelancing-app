
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

import { updateAdminRoleSchema } from "../../../../schemas/admin/admin-role.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useAdminRole } from "../../../../hooks/admin/role/useAdminRole";
import { useUpdateAdminRole } from "../../../../hooks/admin/role/useUpdateAdminRole";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
};

export default function UpdateRoleDialog({
    open,
    roleId,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        data: roleResponse,
        isLoading: isRoleLoading,
        isError: isRoleError,
        error: roleError,
        refetch,
    } = useAdminRole(open ? roleId : null);

    const role = roleResponse?.data?.data ??
        roleResponse?.data ??
        roleResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminRole();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminRoleSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && role) {
            reset({
                name: role.name ?? "",
            });

            resetMutation();
        }
    }, [open, role, reset, resetMutation]);

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
                roleId,
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
            title={t("admin.roles.update.title")}
            subtitle={t("admin.roles.update.subtitle")}
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
                        form="update-role-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isRoleLoading ||
                            isRoleError ||
                            !role
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
                            ? t("admin.roles.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isRoleLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isRoleError ? (
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
                    {roleError?.response?.data?.message ||
                        t("admin.roles.update.loadError")}
                </Alert>
            ) : role ? (
                <Stack
                    component="form"
                    id="update-role-form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2.5}
                >
                    <TextField
                        label={t("admin.roles.fields.name")}
                        fullWidth
                        autoFocus
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    {isError && (
                        <Alert severity="error">
                            {error?.response?.data?.message ||
                                t("admin.roles.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );
}
