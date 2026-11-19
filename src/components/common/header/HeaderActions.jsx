
import { useState } from "react";
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { palettes } from "../../../theme/palettes";
import { useThemeSettings } from "../../../theme/ThemeSettingsContext";
import { useRole } from "../../../context/RoleContext";
import { useAuth } from "../../../context/AuthContext";
import { useLogout } from "../../../hooks/auth/useLogout";

import LanguageSwitcher from "../LanguageSwitcher";
import RoleSwitch from "../../layouts/RoleSwitch";

export default function HeaderActions({ showRoleSwitch = false }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const { settings, toggleMode, setPaletteKey } = useThemeSettings();
    const { activeRole, setActiveRole } = useRole();
    const { logout } = useAuth();

    const {
        mutateAsync: logoutRequest,
        isPending: isLoggingOut,
    } = useLogout();

    const [anchorPalette, setAnchorPalette] = useState(null);
    const [anchorUser, setAnchorUser] = useState(null);

    const closePalette = () => setAnchorPalette(null);
    const closeUser = () => setAnchorUser(null);

    const handleLogout = async () => {
        closeUser();

        try {
            await logoutRequest();
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            logout();
            navigate("/auth/login", { replace: true });
        }
    };

    const handleRoleChange = (role) => {
        setActiveRole(role);
        closePalette();
        closeUser();

        navigate(role === "employer" ? "/my-projects" : "/projects");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
            }}
        >
            <LanguageSwitcher />

            <Tooltip
                title={
                    settings.mode === "dark"
                        ? "Switch to light"
                        : "Switch to dark"
                }
            >
                <IconButton
                    onClick={toggleMode}
                    sx={{ color: "text.primary" }}
                >
                    {settings.mode === "dark" ? (
                        <LightModeOutlinedIcon />
                    ) : (
                        <DarkModeOutlinedIcon />
                    )}
                </IconButton>
            </Tooltip>

            <Tooltip title="Palette">
                <IconButton
                    onClick={(event) =>
                        setAnchorPalette(event.currentTarget)
                    }
                    sx={{ color: "text.primary" }}
                >
                    <PaletteOutlinedIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorPalette}
                open={!!anchorPalette}
                onClose={closePalette}
            >
                {Object.entries(palettes).map(([key, palette]) => (
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
                                borderRadius: "50%",
                                bgcolor: palette.primary,
                                border: `1px solid ${theme.palette.surface.border}`,
                            }}
                        />
                        {palette.name}
                    </MenuItem>
                ))}
            </Menu>

            {showRoleSwitch && (
                <RoleSwitch
                    value={activeRole}
                    onChange={handleRoleChange}
                />
            )}

            <Tooltip title="Notifications">
                <IconButton sx={{ color: "text.primary" }}>
                    <Badge badgeContent={2} color="primary">
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Tooltip title="Account">
                <IconButton
                    onClick={(event) =>
                        setAnchorUser(event.currentTarget)
                    }
                    sx={{ p: 0.5 }}
                >
                    <Avatar sx={{ width: 34, height: 34 }}>A</Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorUser}
                open={!!anchorUser}
                onClose={closeUser}
            >
                <MenuItem onClick={closeUser}>Profile</MenuItem>
                <MenuItem onClick={closeUser}>Settings</MenuItem>
                <MenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </MenuItem>
            </Menu>
        </Box>
    );
}
