
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
} from "@mui/material";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { alpha, useTheme } from "@mui/material/styles";

import HeaderActions from "../../common/header/HeaderActions";

export default function AdminTopbar() {
    const theme = useTheme();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backdropFilter: "blur(14px)",
                bgcolor:
                    theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.default, 0.65)
                        : alpha(theme.palette.background.paper, 0.72),
                borderBottom: `1px solid ${theme.palette.surface.border}`,
                color: "text.primary",
            }}
        >
            <Toolbar sx={{ gap: 1.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <AdminPanelSettingsRoundedIcon
                        sx={{ color: "primary.main" }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: 0.2,
                        }}
                    >
                        Admin Panel
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <HeaderActions />
            </Toolbar>
        </AppBar>
    );
}
