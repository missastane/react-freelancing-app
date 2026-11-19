
import { Drawer, List, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";

import AdminNavItem from "./AdminNavItem";
import AdminNavGroup from "./AdminNavGroup";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ConstructionIcon from "@mui/icons-material/Construction";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PublicIcon from "@mui/icons-material/Public";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

const drawerWidth = 260;

export default function AdminSidebar() {
    const { t } = useTranslation();

    const menuItems = [
        {
            type: "item",
            labelKey: "admin.sidebar.dashboard",
            to: "/admin",
            icon: <DashboardIcon />,
            end: true,
        },
        {
            type: "group",
            labelKey: "admin.sidebar.userManagement",
            icon: <PeopleIcon />,
            items: [
                {
                    label: t("admin.sidebar.users"),
                    to: "/admin/users",
                    icon: <PeopleIcon />,
                },
                {
                    label: t("admin.sidebar.skills"),
                    to: "/admin/skills",
                    icon: <ConstructionIcon />,
                },
            ],
        },
        {
            type: "group",
            labelKey: "admin.sidebar.accessManagement",
            icon: <SecurityRoundedIcon />,
            items: [
                {
                    label: t("admin.sidebar.roles"),
                    to: "/admin/roles",
                    icon: <AdminPanelSettingsRoundedIcon />,
                },
                {
                    label: t("admin.sidebar.permissions"),
                    to: "/admin/permissions",
                    icon: <SecurityRoundedIcon />,
                },
            ],
        },
        {
            type: "group",
            labelKey: "admin.sidebar.localeManagement",
            icon: <PublicIcon />,
            items: [
                {
                    label: t("admin.sidebar.provinces"),
                    to: "/admin/provinces",
                    icon: <PublicIcon />,
                },
            ],
        },
        {
            type: "group",
            labelKey: "admin.sidebar.supportManagement",
            icon: <SupportAgentIcon />,
            items: [
                {
                    label: t("admin.sidebar.departments"),
                    to: "/admin/departments",
                    icon: <ApartmentRoundedIcon />,
                },
                {
                    label: t("admin.sidebar.tickets"),
                    to: "/admin/tickets",
                    icon: <SupportAgentIcon />,
                },
            ],
        },
        {
            type: "item",
            labelKey: "admin.sidebar.projects",
            to: "/admin/projects",
            icon: <WorkOutlineIcon />,
        },
        {
            type: "item",
            labelKey: "admin.sidebar.content",
            to: "/admin/content",
            icon: <ArticleIcon />,
        },
        {
            type: "item",
            labelKey: "admin.sidebar.reports",
            to: "/admin/reports",
            icon: <BarChartIcon />,
        },
        {
            type: "item",
            labelKey: "admin.sidebar.settings",
            to: "/admin/settings",
            icon: <SettingsIcon />,
        },
    ];

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
                    overflowY: "auto",

                    "&::-webkit-scrollbar": {
                        width: 5,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: "action.disabledBackground",
                        borderRadius: 5,
                    },
                },
            }}
        >
            <Toolbar />

            <List sx={{ px: 1.25, py: 1 }}>
                {menuItems.map((item) =>
                    item.type === "group" ? (
                        <AdminNavGroup
                            key={item.labelKey}
                            label={t(item.labelKey)}
                            icon={item.icon}
                            items={item.items}
                        />
                    ) : (
                        <AdminNavItem
                            key={item.to}
                            {...item}
                            label={t(item.labelKey)}
                        />
                    )
                )}
            </List>
        </Drawer>

    );
}
