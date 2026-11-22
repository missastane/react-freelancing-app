import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    Box,
} from "@mui/material";
import {
    ExtensionOutlined,
    KeyOutlined,
    DataObjectOutlined,
} from "@mui/icons-material";

export default function SubscriptionFeaturesSection({ features = [], t }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography variant="h6" fontWeight={700}>
                        {t("admin.subscriptions.details.features")}
                    </Typography>

                    <Chip
                        label={features.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Stack>

                {features.length === 0 ? (
                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <ExtensionOutlined
                            sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {t("admin.subscriptions.details.noFeatures")}
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 2,
                        }}
                    >
                        {features.map((feature) => {
                            const isLimited =
                                feature.is_limited === true ||
                                feature.is_limited === 1 ||
                                feature.is_limited === "1";

                            return (
                                <Box
                                    key={feature.id ?? feature.feature_key}
                                    sx={{
                                        p: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        minWidth: 0,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap={1}
                                        mb={1.5}
                                    >
                                        <Typography fontWeight={700}>
                                            {feature.feature_persian_key || feature.feature_key}
                                        </Typography>

                                        <Chip
                                            size="small"
                                            color={isLimited ? "warning" : "success"}
                                            label={
                                                isLimited
                                                    ? t("admin.subscriptions.details.limited")
                                                    : t("admin.subscriptions.details.unlimited")
                                            }
                                        />
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <KeyOutlined
                                                fontSize="small"
                                                color="action"
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ overflowWrap: "anywhere" }}
                                            >
                                                {feature.feature_key || "—"}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DataObjectOutlined
                                                fontSize="small"
                                                color="action"
                                            />
                                            <Typography variant="body2">
                                                {feature.feature_value || "—"}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {t("admin.subscriptions.details.valueType")}:{" "}
                                            {feature.feature_value_type || "—"}
                                        </Typography>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}