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

import { updateAdminSkillSchema } from "../../../../schemas/admin/admin-skill.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useAdminSkill } from "../../../../hooks/admin/skill/useAdminSkill";
import { useUpdateAdminSkill } from "../../../../hooks/admin/skill/useUpdateAdminSkill";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    persian_title: "",
    original_title: "",
};

export default function UpdateSkillDialog({
    open,
    skillId,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const {
        data: skillResponse,
        isLoading: isSkillLoading,
        isError: isSkillError,
        error: skillError,
        refetch,
    } = useAdminSkill(open ? skillId : null);

    const skill = skillResponse?.data?.data ??
        skillResponse?.data ??
        skillResponse;

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useUpdateAdminSkill();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateAdminSkillSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open && skill) {
            reset({
                persian_title: skill.persian_title ?? "",
                original_title: skill.original_title ?? "",
            });

            resetMutation();
        }
    }, [open, skill, reset, resetMutation]);

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
                skillId,
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
            title={t("admin.skills.update.title")}
            subtitle={t("admin.skills.update.subtitle")}
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
                        form="update-skill-form"
                        variant="contained"
                        disabled={
                            isPending ||
                            isSkillLoading ||
                            isSkillError ||
                            !skill
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
                            ? t("admin.skills.update.updating")
                            : t("common.save")}
                    </Button>
                </>
            }
            actionsSx={{
                px: 3,
                py: 2,
            }}
        >
            {isSkillLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={5}
                >
                    <CircularProgress />
                </Box>
            ) : isSkillError ? (
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
                    {skillError?.response?.data?.message ||
                        t("admin.skills.update.loadError")}
                </Alert>
            ) : skill ? (
                <Stack
                    component="form"
                    id="update-skill-form"
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
                                t("admin.skills.update.error")}
                        </Alert>
                    )}
                </Stack>
            ) : null}
        </BaseDialog>
    );
}