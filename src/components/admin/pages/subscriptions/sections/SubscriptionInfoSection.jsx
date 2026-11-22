import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
    CalendarTodayOutlined,
    PaymentsOutlined,
    PercentOutlined,
    ScheduleOutlined,
} from "@mui/icons-material";

function InfoItem({ label, value, icon }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                minWidth: 0,
            }}
        >
            {icon}
            <Box minWidth={0}>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight={700} noWrap>
                    {value ?? "—"}
                </Typography>
            </Box>
        </Box>
    );
}

export default function SubscriptionInfoSection({ subscription, t, locale }) {
    const formatNumber = (value) => {
        if (value === null || value === undefined || value === "") return "—";

        return new Intl.NumberFormat(locale).format(Number(value));
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                    {t("admin.subscriptions.details.basicInfo")}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoItem
                            label={t("admin.subscriptions.fields.name")}
                            value={subscription.name}
                            icon={<CalendarTodayOutlined color="action" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoItem
                            label={t("admin.subscriptions.fields.amount")}
                            value={formatNumber(subscription.amount)}
                            icon={<PaymentsOutlined color="action" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoItem
                            label={t("admin.subscriptions.fields.durationDays")}
                            value={`${formatNumber(subscription.duration_days)} ${t("admin.subscriptions.details.days")}`}
                            icon={<ScheduleOutlined color="action" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoItem
                            label={t("admin.subscriptions.fields.commissionRate")}
                            value={`${formatNumber(subscription.commission_rate)}%`}
                            icon={<PercentOutlined color="action" />}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}