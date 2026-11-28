import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import BaseDialog from "../../../common/BaseDialog";
import SecurityHintBox from "../shared/SecurityHintBox";

import { changePasswordSchema } from "../../../../schemas/profile/change-password.schema";
import { useChangeProfilePassword } from "../../../../hooks/profile/useChangeProfilePassword";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
};

export default function ChangePasswordDialog({
    open,
    onClose,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const {
        mutateAsync,
        isPending,
        reset: resetMutation,
    } = useChangeProfilePassword();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(changePasswordSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
            resetMutation();

            setShowPasswords({
                current: false,
                new: false,
                confirm: false,
            });
        }
    }, [open, reset, resetMutation]);

    const handleClose = () => {
        if (isPending) return;

        reset(defaultValues);
        resetMutation();
        onClose();
    };

    const onSubmit = async (values) => {
        resetMutation();

        try {
            const response = await mutateAsync(values);

            showNotification(
                response.message || t("profile.changePassword.success"),
                "success"
            );

            reset(defaultValues);
            onClose();

        } catch (err) {
            const validationErrors = err?.response?.data?.errors;
            const serverMessage = err?.response?.data?.message;

            if (validationErrors) {
                Object.entries(validationErrors).forEach(
                    ([field, messages]) => {
                        setError(field, {
                            type: "server",
                            message: messages?.[0],
                        });
                    }
                );
            }

            showNotification(
                serverMessage || t("profile.changePassword.error"),
                "error"
            );
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const passwordAdornment = (field) => (
        <InputAdornment position="end">
            <IconButton
                edge="end"
                onClick={() => togglePasswordVisibility(field)}
                onMouseDown={(event) => event.preventDefault()}
                aria-label={t(
                    showPasswords[field]
                        ? "profile.changePassword.hidePassword"
                        : "profile.changePassword.showPassword"
                )}
            >
                {showPasswords[field] ? (
                    <VisibilityOffRoundedIcon />
                ) : (
                    <VisibilityRoundedIcon />
                )}
            </IconButton>
        </InputAdornment>
    );

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("profile.changePassword.title")}
            subtitle={t("profile.changePassword.subtitle")}
            icon={<LockResetRoundedIcon />}
            maxWidth="xs"
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
                        form="change-password-form"
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
                            ? t("profile.changePassword.submitting")
                            : t("profile.changePassword.submit")}
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
                id="change-password-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={2.5}
            >
                <TextField
                    label={t("profile.changePassword.fields.current")}
                    type={showPasswords.current ? "text" : "password"}
                    fullWidth
                    autoFocus
                    {...register("current_password")}
                    error={!!errors.current_password}
                    helperText={errors.current_password?.message}
                    slotProps={{
                        input: {
                            endAdornment: passwordAdornment("current"),
                        },
                    }}
                />

                <TextField
                    label={t("profile.changePassword.fields.new")}
                    type={showPasswords.new ? "text" : "password"}
                    fullWidth
                    {...register("new_password")}
                    error={!!errors.new_password}
                    helperText={errors.new_password?.message}
                    slotProps={{
                        input: {
                            endAdornment: passwordAdornment("new"),
                        },
                    }}
                />

                <TextField
                    label={t("profile.changePassword.fields.confirm")}
                    type={showPasswords.confirm ? "text" : "password"}
                    fullWidth
                    {...register("new_password_confirmation")}
                    error={!!errors.new_password_confirmation}
                    helperText={errors.new_password_confirmation?.message}
                    slotProps={{
                        input: {
                            endAdornment: passwordAdornment("confirm"),
                        },
                    }}
                />

                <SecurityHintBox>
                    <Typography variant="body2" color="text.secondary">
                        {t("profile.changePassword.hint")}
                    </Typography>
                </SecurityHintBox>
            </Stack>
        </BaseDialog>
    );
}