
import { Box, Stack, Typography } from "@mui/material";

export default function AccountRow({ title, desc, action, disabled }) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
                alignItems: { sm: "center" },
                justifyContent: "space-between",
                py: 1.5,
                opacity: disabled ? 0.6 : 1,
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>

                {desc && (
                    <Typography variant="body2" color="text.secondary">
                        {desc}
                    </Typography>
                )}
            </Box>

            <Box sx={{ flexShrink: 0 }}>
                {action}
            </Box>
        </Stack>
    );
}
