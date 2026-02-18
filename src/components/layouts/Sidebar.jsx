import React from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import { navItemsByRole } from "../../app/navConfig";
import { useRole } from "../../context/RoleContext";

export default function Sidebar({ width = 280, onNavigate }) {
  const theme = useTheme();
  const { activeRole } = useRole();

  const items = navItemsByRole?.[activeRole] ?? navItemsByRole.freelancer;

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: "inherit",
    display: "block",
    borderRadius: 12,
    overflow: "hidden",
    ...(isActive
      ? { background: theme.palette.surface.strong }
      : { background: "transparent" }),
  });

  return (
    <Box
      sx={{
        width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        bgcolor:theme.palette.surface.soft
      }}
    >
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
          Freelance Platform
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activeRole === "employer" ? "Employer Dashboard" : "Freelancer Dashboard"}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: theme.palette.surface.border }} />

      <Box sx={{ p: 1.5, flexGrow: 1 }}>
        <List sx={{ display: "grid", gap: 0.8 }}>
          {items.map((item) => {
            const IconComp = item.icon;

            return (
              <NavLink key={item.path} to={item.path} style={linkStyle} onClick={onNavigate}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: theme.palette.surface.soft,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <IconComp />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </NavLink>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: theme.palette.surface.border }} />
      <Box sx={{ p: 2, color: "text.secondary", fontSize: 12 }}>
        v0.1 • UI in progress
      </Box>
    </Box>
  );
}
