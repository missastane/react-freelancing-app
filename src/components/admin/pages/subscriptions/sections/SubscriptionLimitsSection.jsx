import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
import {
    WorkOutline,
    NotificationsNone,
    EmailOutlined,
    SmsOutlined,
    VisibilityOutlined,
} from "@mui/icons-material";

function LimitItem({ label, value, formatNumber }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>

            <Typography variant="body1" fontWeight={700}>
                {formatNumber(value)}
            </Typography>
        </Box>
    );
}

export default function SubscriptionLimitsSection({
    subscription,
    t,
    locale,
}) {
    const formatNumber = (value) => {
        if (value === null || value === undefined || value === "") return "—";

        return new Intl.NumberFormat(locale).format(Number(value));
    };

    const limits = [
        {
            key: "max_target_per_month",
            label: "maxTargetPerMonth",
            icon: <WorkOutline color="action" />,
        },
        {
            key: "max_notification_per_month",
            label: "maxNotificationPerMonth",
            icon: <NotificationsNone color="action" />,
        },
        {
            key: "max_email_per_month",
            label: "maxEmailPerMonth",
            icon: <EmailOutlined color="action" />,
        },
        {
            key: "max_sms_per_month",
            label: "maxSmsPerMonth",
            icon: <SmsOutlined color="action" />,
        },
        {
            key: "max_view_deatils_per_month",
            label: "maxViewDetailsPerMonth",
            icon: <VisibilityOutlined color="action" />,
        },
    ];

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                    {t("admin.subscriptions.details.monthlyLimits")}
                </Typography>

                <Grid container spacing={2}>
                    {limits.map((limit) => (
                        <Grid key={limit.key} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    {limit.icon}
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(`admin.subscriptions.fields.${limit.label}`)}
                                    </Typography>
                                </Box>

                                <LimitItem
                                    label={t("admin.subscriptions.details.perMonth")}
                                    value={subscription[limit.key]}
                                    formatNumber={formatNumber}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}