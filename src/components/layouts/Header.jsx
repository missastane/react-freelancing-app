import React, { useMemo, useState } from "react";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

import { navItemsByRole } from "../../app/navConfig";
import { palettes } from "../../theme/palettes";
import { useThemeSettings } from "../../theme/ThemeSettingsContext";
import RoleSwitch from "./RoleSwitch";
import useActiveRole from "../../hooks/useActiveRole";

export default function Header({ onOpenDrawer }) {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const { pathname } = useLocation();

    const { settings, toggleMode, setPaletteKey } = useThemeSettings();
    const navigate = useNavigate();
    const { activeRole, setActiveRole } = useActiveRole("freelancer");

    const pageTitle = useMemo(() => {
        const first = "/" + (pathname.split("/")[1] || "");
        const items = navItemsByRole?.[activeRole] || [];
        const match = items.find((x) => x.path === first);
        return match?.label || "Dashboard";
    }, [pathname, activeRole]);


    const [anchorPalette, setAnchorPalette] = useState(null);
    const [anchorUser, setAnchorUser] = useState(null);

    const openPalette = (e) => setAnchorPalette(e.currentTarget);
    const closePalette = () => setAnchorPalette(null);

    const openUser = (e) => setAnchorUser(e.currentTarget);
    const closeUser = () => setAnchorUser(null);

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backdropFilter: "blur(14px)",
                bgcolor: "rgba(0,0,0,0.25)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                zIndex: (t) => t.zIndex.appBar, // یا کلاً این خط رو حذف کن
            }}
        >
            <Toolbar sx={{ gap: 1.25 }}>
                <IconButton edge="start" onClick={onOpenDrawer} sx={{ color: "primary.main" }}>
                    <MenuIcon />
                </IconButton>


                <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
                    {pageTitle}
                </Typography>

                {isLg && (
                    <Box
                        sx={{
                            mx: 2,
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.10)",
                            bgcolor: "rgba(255,255,255,0.04)",
                            maxWidth: 520,
                        }}
                    >
                        <SearchIcon fontSize="small" />
                        <InputBase
                            placeholder="Search jobs, users, messages..."
                            sx={{ flexGrow: 1, fontSize: 14 }}
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Box>
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Tooltip title={settings.mode === "dark" ? "Switch to light" : "Switch to dark"}>
                    <IconButton onClick={toggleMode} sx={{ color: "text.primary" }}>
                        {settings.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Palette">
                    <IconButton onClick={openPalette} sx={{ color: "text.primary" }}>
                        <PaletteOutlinedIcon />
                    </IconButton>
                </Tooltip>

                <Menu anchorEl={anchorPalette} open={!!anchorPalette} onClose={closePalette}>
                    {Object.entries(palettes).map(([key, p]) => (
                        <MenuItem
                            key={key}
                            selected={settings.paletteKey === key}
                            onClick={() => {
                                setPaletteKey(key);
                                closePalette();
                            }}
                            sx={{ gap: 1.2 }}
                        >
                            <Box
                                sx={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 999,
                                    bgcolor: p.primary,
                                    border: "1px solid rgba(0,0,0,0.2)",
                                }}
                            />
                            {p.name}
                        </MenuItem>
                    ))}
                </Menu>
                <RoleSwitch
                    value={activeRole}
                    onChange={(role) => {
                        setActiveRole(role);
                        navigate(role === "employer" ? "/my-projects" : "/projects");
                    }}
                />

                <Tooltip title="Notifications">
                    <IconButton sx={{ color: "text.primary" }}>
                        <Badge badgeContent={2} color="primary">
                            <NotificationsNoneIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Account">
                    <IconButton onClick={openUser} sx={{ p: 0.5 }}>
                        <Avatar sx={{ width: 34, height: 34 }}>A</Avatar>
                    </IconButton>
                </Tooltip>

                <Menu anchorEl={anchorUser} open={!!anchorUser} onClose={closeUser}>
                    <MenuItem onClick={closeUser}>Profile</MenuItem>
                    <MenuItem onClick={closeUser}>Settings</MenuItem>
                    <MenuItem onClick={closeUser}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
