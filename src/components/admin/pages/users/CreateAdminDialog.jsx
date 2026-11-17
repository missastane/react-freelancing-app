
import { useEffect, useState } from "react";

import {
    Alert,
    AppBar,
    Box,
    Button,
    Dialog,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { createAdminSchema } from "../../../../schemas/admin/admin-user.schema";
import { useCreateAdminUser } from "../../../../hooks/admin/admin-user/useCreateAdminUser";

const defaultValues = {
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
};

function Section({ title, subtitle, children }) {
    const theme = useTheme();

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: theme.palette.surface.soft,
                borderColor: theme.palette.surface.border,
                backgroundImage: "none",
            }}
        >
            <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 900 }}>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Stack>

            {children}
        </Paper>
    );
}

export default function CreateAdminDialog({ open, onClose }) {
    const theme = useTheme();
    const { t } = useTranslation();

    const [successOpen, setSuccessOpen] = useState(false);

    const {
        mutateAsync,
        isPending,
        isError,
        error,
        reset: resetMutation,
    } = useCreateAdminUser();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createAdminSchema(t)),
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
        onClose?.();
    };

    const onSubmit = async (values) => {
        resetMutation();

        try {
            await mutateAsync(values);

            reset(defaultValues);
            setSuccessOpen(true);
            onClose?.();
        } catch (submitError) {
            const validationErrors = submitError?.response?.data?.errors;

            if (
                validationErrors &&
                typeof validationErrors === "object"
            ) {
                Object.entries(validationErrors).forEach(
                    ([field, messages]) => {
                        if (field in defaultValues) {
                            setError(field, {
                                type: "server",
                                message: Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            });
                        }
                    }
                );
            }
        }
    };

    const validationErrors = error?.response?.data?.errors;

    const serverMessage =
        error?.response?.data?.message ||
        t("admin.users.create.error");

    const isValidationError =
        validationErrors &&
        typeof validationErrors === "object" &&
        Object.keys(validationErrors).length > 0;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
                PaperProps={{
                    sx: {
                        bgcolor:
                            theme.palette.mode === "dark"
                                ? theme.palette.surface.soft
                                : theme.palette.background.default,
                        backgroundImage: "none",
                    },
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: theme.palette.surface.strong,
                        borderBottom: "1px solid",
                        borderColor: theme.palette.surface.border,
                        backgroundImage: "none",
                    }}
                >
                    <Toolbar sx={{ gap: 1 }}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 900 }}
                                noWrap
                            >
                                {t("admin.users.create.title")}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                            >
                                {t("admin.users.create.subtitle")}
                            </Typography>
                        </Box>

                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            disabled={isPending || isSubmitting}
                            sx={{
                                borderRadius: 2.5,
                                fontWeight: 900,
                                textTransform: "none",
                            }}
                        >
                            {isPending
                                ? t("admin.users.create.creating")
                                : t("admin.users.create.submit")}
                        </Button>

                        <IconButton
                            onClick={handleClose}
                            disabled={isPending}
                            aria-label={t("common.close")}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                        sx={{
                            maxWidth: 760,
                            mx: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {isError && !isValidationError && (
                            <Alert severity="error">
                                {serverMessage}
                            </Alert>
                        )}

                        <Section
                            title={t("admin.users.create.infoTitle")}
                            subtitle={t("admin.users.create.infoSubtitle")}
                        >
                            <Stack spacing={2}>
                                <TextField
                                    label={t("admin.users.fields.firstName")}
                                    placeholder={t(
                                        "admin.users.placeholders.firstName"
                                    )}
                                    fullWidth
                                    {...register("first_name")}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message}
                                />

                                <TextField
                                    label={t("admin.users.fields.lastName")}
                                    placeholder={t(
                                        "admin.users.placeholders.lastName"
                                    )}
                                    fullWidth
                                    {...register("last_name")}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />

                                <TextField
                                    label={t("admin.users.fields.email")}
                                    placeholder="admin@example.com"
                                    type="email"
                                    fullWidth
                                    {...register("email")}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />

                                <TextField
                                    label={t("admin.users.fields.mobile")}
                                    placeholder="09123456789"
                                    type="tel"
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            inputMode: "numeric",
                                            maxLength: 11,
                                        },
                                    }}
                                    {...register("mobile")}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile?.message}
                                />
                            </Stack>
                        </Section>

                        <Section
                            title={t("admin.users.create.accountTitle")}
                            subtitle={t("admin.users.create.accountSubtitle")}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >
                                <PersonAddAlt1RoundedIcon color="action" />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {t("admin.users.create.accountDescription")}
                                </Typography>
                            </Stack>
                        </Section>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: theme.palette.surface.strong,
                                borderColor: theme.palette.surface.border,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                            }}
                        >
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                disabled={isPending}
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 800,
                                    textTransform: "none",
                                }}
                            >
                                {t("common.cancel")}
                            </Button>

                            <Button
                                onClick={handleSubmit(onSubmit)}
                                variant="contained"
                                disabled={isPending || isSubmitting}
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 900,
                                    textTransform: "none",
                                }}
                            >
                                {isPending
                                    ? t("admin.users.create.creating")
                                    : t("admin.users.create.submit")}
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            </Dialog>

            <Snackbar
                open={successOpen}
                autoHideDuration={5000}
                onClose={(_, reason) => {
                    if (reason !== "clickaway") {
                        setSuccessOpen(false);
                    }
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {t("admin.users.create.success")}
                </Alert>
            </Snackbar>
        </>
    );
}
