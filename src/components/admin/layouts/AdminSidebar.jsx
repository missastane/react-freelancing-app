import { Drawer, List, Toolbar } from "@mui/material";
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
  { label: "Dashboard", to: "/admin", icon: <DashboardIcon /> },
  { label: "Users", to: "/admin/users", icon: <PeopleIcon /> },
  { label: "Skills", to: "/admin/skills", icon: <ConstructionIcon /> },
  { label: "Projects", to: "/admin/projects", icon: <WorkOutlineIcon /> },
  { label: "Tickets", to: "/admin/tickets", icon: <SupportAgentIcon /> },
  { label: "Content", to: "/admin/content", icon: <ArticleIcon /> },
  { label: "Reports", to: "/admin/reports", icon: <BarChartIcon /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
];

export default function AdminSidebar() {
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
          <AdminNavItem key={it.to} {...it} />
        ))}
      </List>
    </Drawer>
  );
}