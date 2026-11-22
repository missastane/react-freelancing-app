import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAdminSubscription } from "../../../../hooks/admin/subscription/useAdminSubscription";
import BaseDialog from "../../../common/BaseDialog";

import SubscriptionInfoSection from "./sections/SubscriptionInfoSection";
import SubscriptionLimitsSection from "./sections/SubscriptionLimitsSection";
import SubscriptionFeaturesSection from "./sections/SubscriptionFeaturesSection";

export default function SubscriptionDetailsDialog({
    open,
    subscriptionId,
    onClose,
}) {
    const { t, i18n } = useTranslation();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAdminSubscription(open ? subscriptionId : null);

    const subscription =
        data?.data?.data ?? data?.data ?? data;

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return value;

        return new Intl.DateTimeFormat(i18n.language, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={t("admin.subscriptions.details.title")}
            subtitle={t("admin.subscriptions.details.subtitle")}
            maxWidth="lg"
            fullWidth
            showCloseButton
            contentSx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: "background.default",
            }}
        >
            {isLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={300}
                >
                    <CircularProgress />
                </Box>
            ) : isError ? (
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
                    {error?.response?.data?.message ||
                        t("admin.subscriptions.details.loadError")}
                </Alert>
            ) : subscription ? (
                <Stack spacing={2.5}>
                    <SubscriptionInfoSection
                        subscription={subscription}
                        t={t}
                        locale={i18n.language}
                    />

                    <SubscriptionLimitsSection
                        subscription={subscription}
                        t={t}
                        locale={i18n.language}
                    />

                    <SubscriptionFeaturesSection
                        features={subscription.features ?? []}
                        t={t}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            pt: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {t("admin.subscriptions.details.createdAt")}:{" "}
                            {formatDate(subscription.created_at)}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {t("admin.subscriptions.details.updatedAt")}:{" "}
                            {formatDate(subscription.updated_at)}
                        </Typography>
                    </Box>
                </Stack>
            ) : null}

            {isFetching && !isLoading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                    }}
                >
                    <CircularProgress size={20} />
                </Box>
            )}
        </BaseDialog>
    );
}