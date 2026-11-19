import React, { useMemo } from "react";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme, alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

import { navItemsByRole } from "../../app/navConfig";
import { useRole } from "../../context/RoleContext";
import HeaderActions from "../common/header/HeaderActions";

export default function Header({ onOpenDrawer }) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const { pathname } = useLocation();

  const { activeRole, setActiveRole } = useRole();

  const pageTitle = useMemo(() => {
    const first = "/" + (pathname.split("/")[1] || "");
    const items = navItemsByRole?.[activeRole] ?? [];
    return items.find((x) => x.path === first)?.label ?? "Dashboard";
  }, [pathname, activeRole]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: "blur(14px)",
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.65)
            : alpha(theme.palette.background.paper, 0.72),
        borderBottom: `1px solid ${theme.palette.surface.border}`,
        zIndex: (t) => t.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ gap: 1.25 }}>
        <IconButton edge="start" onClick={onOpenDrawer} sx={{ color: "primary.main" }}>
          <MenuIcon />
        </IconButton>

        <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>{pageTitle}</Typography>

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
              border: `1px solid ${theme.palette.surface.border}`,
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.surface.soft
                  : alpha(theme.palette.common.black, 0.03),
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

        <HeaderActions showRoleSwitch />
      </Toolbar>
    </AppBar>
  );
}
