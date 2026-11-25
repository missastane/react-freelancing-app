import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function SecurityHintBox({ children }) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                backgroundColor: theme.palette.surface?.soft ?? "transparent",
                p: 1.25,
            }}
        >
            {children}
        </Box>
    );
}