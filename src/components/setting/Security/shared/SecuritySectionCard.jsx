import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function SurfaceCard({ children }) {
    const theme = useTheme();
    return (
        <Paper
            variant="outlined"
            sx={{
                borderColor: theme.palette.surface?.border ?? "divider",
                borderRadius: 3,
                backgroundImage: "none",
                overflow: "hidden",
            }}
        >
            {children}
        </Paper>
    );
}

export default function SecuritySectionCard({
    title,
    subtitle,
    children,
    right,
    icon,
}) {
    return (
        <SurfaceCard>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                        {icon ? (
                            <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
                        ) : null}
                        <Box>
                            <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
                            {subtitle ? (
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            ) : null}
                        </Box>
                    </Stack>

                    {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
                </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
        </SurfaceCard>
    );
}