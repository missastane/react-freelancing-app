import * as React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    Box,
    Container,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LinkIcon from "@mui/icons-material/Link";
import HistoryIcon from "@mui/icons-material/History";

const NAV = [
    {
        to: "/settings/account",
        label: "account",
        icon: <PersonOutlineIcon fontSize="small" />,
    },
    {
        to: "/settings/security",
        label: "security",
        icon: <SecurityIcon fontSize="small" />,
    },
    {
        to: "/settings/notifications",
        label: "notifications",
        icon: <NotificationsNoneIcon fontSize="small" />,
    },
    {
        to: "/settings/privacy",
        label: "privacy",
        icon: <LockOutlinedIcon fontSize="small" />,
    },
    {
        to: "/settings/connections",
        label: "connections",
        icon: <LinkIcon fontSize="small" />,
    },
    {
        to: "/settings/activity",
        label: "activity",
        icon: <HistoryIcon fontSize="small" />,
    },
];

function activeIndex(pathname) {
    const idx = NAV.findIndex((i) => pathname.startsWith(i.to));
    return idx === -1 ? 0 : idx;
}

export default function SettingsLayout() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const location = useLocation();
    const { t } = useTranslation();

    const tab = activeIndex(location.pathname);

    return (
        <Box sx={{ py: { xs: 2, md: 4 } }}>
            <Container maxWidth="lg">
                <Stack spacing={0.75} sx={{ mb: 2 }}>
                    <Typography variant="h4">
                        {t("settings.layout.title")}
                    </Typography>

                    <Typography color="text.secondary">
                        {t("settings.layout.subtitle")}
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "320px 1fr",
                        },
                        gap: 2,
                        alignItems: "start",
                        minWidth: 0,
                    }}
                >
                    {/* Desktop left nav */}
                    <Paper
                        variant="outlined"
                        sx={{
                            display: { xs: "none", md: "block" },
                            borderColor:
                                theme.palette.surface?.border ?? "divider",
                            borderRadius: 3,
                            backgroundImage: "none",
                            minWidth: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ p: 2, minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 800 }}
                            >
                                {t("settings.layout.preferences")}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("settings.layout.preferencesDescription")}
                            </Typography>
                        </Box>

                        <Divider />

                        <List sx={{ p: 1 }}>
                            {NAV.map((item) => (
                                <ListItemButton
                                    key={item.to}
                                    component={NavLink}
                                    to={item.to}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        "&.active": {
                                            backgroundColor:
                                                theme.palette.surface?.soft ??
                                                "action.selected",
                                            border: `1px solid ${
                                                theme.palette.surface
                                                    ?.borderTint ??
                                                theme.palette.divider
                                            }`,
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={t(
                                            `settings.layout.menu.${item.label}`
                                        )}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>

                    {/* Mobile tabs */}
                    {!isMdUp && (
                        <Paper
                            variant="outlined"
                            sx={{
                                borderColor:
                                    theme.palette.surface?.border ?? "divider",
                                borderRadius: 3,
                                backgroundImage: "none",
                                minWidth: 0,
                                overflow: "visible",
                            }}
                        >
                            <Tabs
                                value={tab}
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                sx={{
                                    px: 1,
                                    minWidth: 0,
                                    "& .MuiTabs-scroller": {
                                        overflowX: "auto",
                                    },
                                }}
                            >
                                {NAV.map((item) => (
                                    <Tab
                                        key={item.to}
                                        label={t(
                                            `settings.layout.menu.${item.label}`
                                        )}
                                        component={NavLink}
                                        to={item.to}
                                        sx={{ minHeight: 48 }}
                                    />
                                ))}
                            </Tabs>
                        </Paper>
                    )}

                    {/* Content */}
                    <Paper
                        variant="outlined"
                        sx={{
                            borderColor:
                                theme.palette.surface?.border ?? "divider",
                            borderRadius: 3,
                            backgroundImage: "none",
                            minWidth: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
                            <Outlet />
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}