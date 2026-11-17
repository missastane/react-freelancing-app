
import { Drawer, List, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";

import AdminNavItem from "./AdminNavItem";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ConstructionIcon from "@mui/icons-material/Construction";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 260;

const items = [
    { labelKey: "admin.sidebar.dashboard", to: "/admin", icon: <DashboardIcon /> },
    { labelKey: "admin.sidebar.users", to: "/admin/users", icon: <PeopleIcon /> },
    { labelKey: "admin.sidebar.skills", to: "/admin/skills", icon: <ConstructionIcon /> },
    { labelKey: "admin.sidebar.projects", to: "/admin/projects", icon: <WorkOutlineIcon /> },
    { labelKey: "admin.sidebar.tickets", to: "/admin/tickets", icon: <SupportAgentIcon /> },
    { labelKey: "admin.sidebar.content", to: "/admin/content", icon: <ArticleIcon /> },
    { labelKey: "admin.sidebar.reports", to: "/admin/reports", icon: <BarChartIcon /> },
    { labelKey: "admin.sidebar.settings", to: "/admin/settings", icon: <SettingsIcon /> },
];

export default function AdminSidebar() {
    const { t } = useTranslation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    borderRight: 1,
                    borderColor: "surface.border",
                    bgcolor: "background.paper",
                },
            }}
        >
            <Toolbar />

            <List sx={{ px: 1 }}>
                {items.map((it) => (
                    <AdminNavItem
                        key={it.to}
                        {...it}
                        label={t(it.labelKey)}
                    />
                ))}
            </List>
        </Drawer>
    );
}
