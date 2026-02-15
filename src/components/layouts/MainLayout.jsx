import React, { useState } from "react";
import { Box, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DRAWER_WIDTH = 280;

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header (hamburger should show on desktop too) */}
      <Header onOpenDrawer={openDrawer} />

      {/* Drawer overlay on ALL screen sizes */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
          BackdropProps: { sx: { bgcolor: "rgba(0,0,0,0.6)" } },
        }}
        sx={{
          zIndex: (t) => t.zIndex.appBar + 2, // روی هدر بیفته
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "background.default",     // یا یه رنگ ثابت مثل "#0B0F14"
            backdropFilter: "none",            // شیشه‌ای/blur خاموش
            backgroundImage: "none",           // مطمئن برای مود dark
            borderRight: "1px solid rgba(255,255,255,0.08)",
            overflowX:"hidden"
          },
        }}
      >
        <Sidebar width={DRAWER_WIDTH} onNavigate={closeDrawer} />
      </Drawer>


      {/* Content */}
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
