import React, { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = 280;

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(14px)",
          bgcolor: "rgba(0,0,0,0.25)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {!isDesktop && (
            <IconButton color="inherit" edge="start" onClick={openMobile}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* later: theme switcher / notifications / avatar */}
          <Typography variant="body2" color="text.secondary">
            UI Mode
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Desktop (permanent) */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              overflowX:"hidden"
            },
          }}
        >
          <Toolbar />
          <Sidebar width={SIDEBAR_WIDTH} />
        </Drawer>
      )}

      {/* Sidebar - Mobile (temporary) */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
        >
          <Toolbar />
          <Sidebar width={SIDEBAR_WIDTH} onNavigate={closeMobile} />
        </Drawer>
      )}

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
