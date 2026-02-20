import React from "react";
import {
    Box,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

export default function FinancialLayout({
    title,
    subtitle,
    primaryAction,
    secondaryAction,
    kpis,
    chart,
    side,
    filters,
    table,
}) {
    const theme = useTheme();

    const rowSx = {
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "stretch",
        width: "100%",
    };

    // ✅ دقیقاً مثل داشبورد: بدون gap
    const kpiWrapSx = {
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", md: "1 1 0%" },
        flexDirection: { xs: "column", md: "row" },
        minWidth: { xs: "100%", sm: 350, md: 270 },
        gap: 2,
        display: "flex",
    };

    const row2LeftWrapSx = {
        flex: { xs: "1 1 100%", md: "1.55 1 0%" },
        minWidth: { xs: "100%", md: 560 },
        display: "flex",
        alignItems: "stretch",
    };

    const row2RightWrapSx = {
        flex: { xs: "1 1 100%", md: "0.9 1 0%" },
        minWidth: { xs: "100%", md: 380 },
        display: "flex",
        alignItems: "stretch",
    };

    return (
        <Box
            sx={{
                py: { xs: 3, sm: 4 },
                overflowX: "hidden",
                bgcolor: theme.palette.surface?.soft || theme.palette.background.default,
                minHeight: "100vh",
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    gap={2}
                    sx={{ mb: 2.5 }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }} noWrap>
                            {title}
                        </Typography>
                        {subtitle ? (
                            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                                {subtitle}
                            </Typography>
                        ) : null}
                    </Box>

                    {(primaryAction || secondaryAction) ? (
                        <Stack direction="row" spacing={1.2} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                            {secondaryAction ? secondaryAction : null}
                            {primaryAction ? primaryAction : null}
                        </Stack>
                    ) : null}
                </Stack>

                {/* KPI Row */}
                {kpis ? (
                    <Box sx={rowSx}>
                        {React.Children.map(kpis, (child, idx) => (
                            <Box key={idx} sx={kpiWrapSx}>
                                {child}
                            </Box>
                        ))}
                    </Box>
                ) : null}

                {/* Chart + Side */}
                {(chart || side) ? (
                    <Box sx={{ ...rowSx, mt: 2 }}>
                        {chart ? <Box sx={row2LeftWrapSx}>{chart}</Box> : null}
                        {side ? <Box sx={row2RightWrapSx}>{side}</Box> : null}
                    </Box>
                ) : null}

                {/* Filters + Table */}
                {(filters || table) ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            mt: 2,
                            p: { xs: 2, sm: 2.5 },
                            borderRadius: 3,
                            borderColor: theme.palette.surface?.border || theme.palette.divider,
                            bgcolor: theme.palette.surface?.soft || theme.palette.background.paper,
                            backgroundImage: "none",
                        }}
                    >
                        {filters ? (
                            <>
                                {filters}
                                <Divider sx={{ my: 2, borderColor: "divider" }} />
                            </>
                        ) : null}

                        {table ? table : null}
                    </Paper>
                ) : null}
            </Container>
        </Box>
    );
}