import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
  { label: "Browse Jobs", path: "/projects", icon: WorkOutlineIcon  },
  { label: "My Proposals", path: "/proposals", icon: DescriptionOutlinedIcon },
  { label: "Messages", path: "/messages", icon: ChatBubbleOutlineIcon },
  { label: "Settings", path: "/settings", icon: SettingsOutlinedIcon },
];
