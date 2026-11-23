
import {
    Box,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AccountSection({
    title,
    subtitle,
    children,
    right,
}) {
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
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{
                        alignItems: { sm: "center" },
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography sx={{ fontWeight: 900 }}>
                            {title}
                        </Typography>

                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {right && (
                        <Box sx={{ flexShrink: 0 }}>
                            {right}
                        </Box>
                    )}
                </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                {children}
            </Box>
        </Paper>
    );
}
