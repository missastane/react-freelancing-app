
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

import { createAdminSkillSchema } from "../../../../schemas/admin/admin-skill.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useCreateAdminSkill } from "../../../../hooks/admin/skill/useCreateAdminSkill";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    persian_title: "",
    original_title: "",
};

export default function CreateSkillDialog({
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
    } = useCreateAdminSkill();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createAdminSkillSchema(t)),
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
            title={t("admin.skills.create.title")}
            subtitle={t("admin.skills.create.subtitle")}
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
                        form="create-skill-form"
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
                            ? t("admin.skills.create.creating")
                            : t("admin.skills.create.submit")}
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
                id="create-skill-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={2.5}
            >
                <TextField
                    label={t("admin.skills.fields.persianTitle")}
                    fullWidth
                    autoFocus
                    {...register("persian_title")}
                    error={!!errors.persian_title}
                    helperText={errors.persian_title?.message}
                />

                <TextField
                    label={t("admin.skills.fields.originalTitle")}
                    fullWidth
                    {...register("original_title")}
                    error={!!errors.original_title}
                    helperText={errors.original_title?.message}
                />

                {isError && (
                    <Alert severity="error">
                        {error?.response?.data?.message ||
                            t("admin.skills.create.error")}
                    </Alert>
                )}
            </Stack>
        </BaseDialog>
    );
}
