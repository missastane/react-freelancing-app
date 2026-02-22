import * as React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  { to: "/settings/account", label: "Account", icon: <PersonOutlineIcon fontSize="small" /> },
  { to: "/settings/security", label: "Security", icon: <SecurityIcon fontSize="small" /> },
  { to: "/settings/notifications", label: "Notifications", icon: <NotificationsNoneIcon fontSize="small" /> },
  { to: "/settings/privacy", label: "Privacy", icon: <LockOutlinedIcon fontSize="small" /> },
  { to: "/settings/connections", label: "Connected accounts", icon: <LinkIcon fontSize="small" /> },
  { to: "/settings/activity", label: "Activity log", icon: <HistoryIcon fontSize="small" /> },
];

function activeIndex(pathname) {
  const idx = NAV.findIndex((i) => pathname.startsWith(i.to));
  return idx === -1 ? 0 : idx;
}

export default function SettingsLayout() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const tab = activeIndex(location.pathname);

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={0.75} sx={{ mb: 2 }}>
          <Typography variant="h4">Settings</Typography>
          <Typography color="text.secondary">
            Manage account preferences, security, and privacy.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
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
              borderColor: theme.palette.surface?.border ?? "divider",
              borderRadius: 3,
              backgroundImage: "none",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a section to update.
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
                      backgroundColor: theme.palette.surface?.soft ?? "action.selected",
                      border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          {/* Mobile tabs */}
          {!isMdUp && (
            <Paper
              variant="outlined"
              sx={{
                borderColor: theme.palette.surface?.border ?? "divider",
                borderRadius: 3,
                backgroundImage: "none",
                minWidth: 0,
                overflow: "visible", // ✅ مهم: اسکرول Tabs خفه نشه
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
                  "& .MuiTabs-scroller": { overflowX: "auto" }, // ✅ اسکرول فقط همینجا
                }}
              >
                {NAV.map((item) => (
                  <Tab
                    key={item.to}
                    label={item.label}
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
              borderColor: theme.palette.surface?.border ?? "divider",
              borderRadius: 3,
              backgroundImage: "none",
              minWidth: 0,
              overflow: "hidden", // ✅ فقط اینجا اگر چیزی بیرون زد، کات میشه (نه کل صفحه)
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