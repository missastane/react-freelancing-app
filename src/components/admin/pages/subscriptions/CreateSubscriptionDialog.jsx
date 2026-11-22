
import { useEffect } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    Stack,
    Switch,
    TextField,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
} from "@mui/material";

import { Add, DeleteOutline } from "@mui/icons-material";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { createAdminSubscriptionSchema } from "../../../../schemas/admin/admin-subscription.schema";
import BaseDialog from "../../../common/BaseDialog";
import { useCreateAdminSubscription } from "../../../../hooks/admin/subscription/useCreateAdminSubscription";
import { useNotification } from "../../../../hooks/useNotification";

const defaultValues = {
    name: "",
    amount: "",
    duration_days: "",
    commission_rate: "",
    max_target_per_month: "",
    max_notification_per_month: "",
    max_email_per_month: "",
    max_sms_per_month: "",
    max_view_deatils_per_month: "",
    features: [],
};

const defaultFeature = {
    feature_key: "",
    feature_persian_key: "",
    feature_value: "",
    feature_value_type: "",
    is_limited: false,
};

export default function CreateSubscriptionDialog({
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
    } = useCreateAdminSubscription();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createAdminSubscriptionSchema(t)),
        defaultValues,
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "features",
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

    const numberFields = [
        {
            name: "amount",
            label: "amount",
        },
        {
            name: "duration_days",
            label: "durationDays",
        },
        {
            name: "commission_rate",
            label: "commissionRate",
        },
        {
            name: "max_target_per_month",
            label: "maxTargetPerMonth",
        },
        {
            name: "max_notification_per_month",
            label: "maxNotificationPerMonth",
        },
        {
            name: "max_email_per_month",
            label: "maxEmailPerMonth",
        },
        {
            name: "max_sms_per_month",
            label: "maxSmsPerMonth",
        },
        {
            name: "max_view_deatils_per_month",
            label: "maxViewDetailsPerMonth",
        },
    ];

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("admin.subscriptions.create.title")}
            subtitle={t("admin.subscriptions.create.subtitle")}
            fullScreen
            headerVariant="appBar"
            showCloseButton
            closeButtonDisabled={isPending}
            contentSx={{
                p: 3,
                pt: 4,
                backgroundColor: "background.default",
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
                        form="create-subscription-form"
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
                            ? t("admin.subscriptions.create.creating")
                            : t("admin.subscriptions.create.submit")}
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
                id="create-subscription-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={3}
                sx={{
                    maxWidth: 1200,
                    width: "100%",
                    mx: "auto",
                }}
            >
                {/* Basic Information */}
                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    {t("admin.subscriptions.create.basicInfo")}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t("admin.subscriptions.create.basicInfoDescription")}
                                </Typography>
                            </Box>

                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label={t("admin.subscriptions.fields.name")}
                                        fullWidth
                                        autoFocus
                                        {...register("name")}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </Grid>

                                {numberFields.slice(0, 3).map(({ name, label }) => (
                                    <Grid key={name} size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label={t(`admin.subscriptions.fields.${label}`)}
                                            type="number"
                                            fullWidth
                                            {...register(name)}
                                            error={!!errors[name]}
                                            helperText={errors[name]?.message}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Monthly Limits */}
                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    {t("admin.subscriptions.create.monthlyLimits")}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t("admin.subscriptions.create.monthlyLimitsDescription")}
                                </Typography>
                            </Box>

                            <Grid container spacing={2.5}>
                                {numberFields.slice(3).map(({ name, label }) => (
                                    <Grid key={name} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <TextField
                                            label={t(`admin.subscriptions.fields.${label}`)}
                                            type="number"
                                            fullWidth
                                            {...register(name)}
                                            error={!!errors[name]}
                                            helperText={errors[name]?.message}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Features */}
                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.5}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                alignItems={{ xs: "stretch", sm: "center" }}
                                justifyContent="space-between"
                                spacing={2}
                            >
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        {t("admin.subscriptions.create.features")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("admin.subscriptions.create.featuresDescription")}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() => append(defaultFeature)}
                                >
                                    {t("admin.subscriptions.create.addFeature")}
                                </Button>
                            </Stack>

                            {fields.length === 0 && (
                                <Box
                                    sx={{
                                        py: 5,
                                        textAlign: "center",
                                        border: 1,
                                        borderStyle: "dashed",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        {t("admin.subscriptions.create.noFeatures")}
                                    </Typography>
                                </Box>
                            )}

                            <Grid container spacing={2}>
                                {fields.map((field, index) => (
                                    <Grid key={field.id} size={{ xs: 12, lg: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                height: "100%",
                                                bgcolor: "background.default",
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Stack spacing={2}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                    >
                                                        <Typography fontWeight={700}>
                                                            {t(
                                                                "admin.subscriptions.create.featureNumber",
                                                                { number: index + 1 }
                                                            )}
                                                        </Typography>

                                                        <IconButton
                                                            color="error"
                                                            onClick={() => remove(index)}
                                                            size="small"
                                                            aria-label={t(
                                                                "admin.subscriptions.create.removeFeature"
                                                            )}
                                                        >
                                                            <DeleteOutline />
                                                        </IconButton>
                                                    </Stack>

                                                    <Divider />

                                                    <Grid container spacing={2}>
                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <TextField
                                                                label={t("admin.subscriptions.featureFields.key")}
                                                                fullWidth
                                                                {...register(
                                                                    `features.${index}.feature_key`
                                                                )}
                                                                error={
                                                                    !!errors.features?.[index]?.feature_key
                                                                }
                                                                helperText={
                                                                    errors.features?.[index]?.feature_key?.message
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <TextField
                                                                label={t("admin.subscriptions.featureFields.persianKey")}
                                                                fullWidth
                                                                {...register(
                                                                    `features.${index}.feature_persian_key`
                                                                )}
                                                                error={
                                                                    !!errors.features?.[index]?.feature_persian_key
                                                                }
                                                                helperText={
                                                                    errors.features?.[index]?.feature_persian_key?.message
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <TextField
                                                                label={t("admin.subscriptions.featureFields.value")}
                                                                fullWidth
                                                                {...register(
                                                                    `features.${index}.feature_value`
                                                                )}
                                                                error={
                                                                    !!errors.features?.[index]?.feature_value
                                                                }
                                                                helperText={
                                                                    errors.features?.[index]?.feature_value?.message
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <TextField
                                                                label={t("admin.subscriptions.featureFields.valueType")}
                                                                fullWidth
                                                                {...register(
                                                                    `features.${index}.feature_value_type`
                                                                )}
                                                                error={
                                                                    !!errors.features?.[index]?.feature_value_type
                                                                }
                                                                helperText={
                                                                    errors.features?.[index]?.feature_value_type?.message
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Controller
                                                        name={`features.${index}.is_limited`}
                                                        control={control}
                                                        render={({ field: switchField }) => (
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={!!switchField.value}
                                                                        onChange={(event) =>
                                                                            switchField.onChange(
                                                                                event.target.checked
                                                                            )
                                                                        }
                                                                    />
                                                                }
                                                                label={t(
                                                                    "admin.subscriptions.featureFields.isLimited"
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </CardContent>
                </Card>

                {isError && (
                    <Alert severity="error">
                        {error?.response?.data?.message ||
                            t("admin.subscriptions.create.error")}
                    </Alert>
                )}
            </Stack>

        </BaseDialog>
    );
}
