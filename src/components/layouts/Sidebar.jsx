import React from "react";
import { Box, Divider, Icon, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { navItems } from "../../app/navConfig";

const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: "inherit",
    display: "block",
    borderRadius: 12,
    overflow: "hidden",
    ...(isActive
        ? { background: "rgba(124,92,255,0.14)" }
        : { background: "transparent" }),
});

export default function Sidebar({ width = 280, onNavigate }) {
    return (
        <Box sx={{ width, height: "100%", display: "flex", flexDirection: "column",overflowX:"hidden" }}>
            <Box sx={{ px: 2.5, py: 2 }}>
                <Typography sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
                    Freelance Platform
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Admin / Client / Freelancer
                </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 1.5, flexGrow: 1 }}>
                <List sx={{ display: "grid", gap: 0.8 }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={linkStyle}
                                onClick={onNavigate}
                            >
                                <ListItemButton sx={{ borderRadius: 2 }}>
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </NavLink>
                        );
                    })}

                </List>
            </Box>

            <Divider />
            <Box sx={{ p: 2, color: "text.secondary", fontSize: 12 }}>
                v0.1 • UI in progress
            </Box>
        </Box>
    );
}
