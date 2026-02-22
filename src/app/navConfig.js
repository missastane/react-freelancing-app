import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
export const navItemsByRole = {
  freelancer: [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Profile", path: "/profile", icon: PersonRoundedIcon },
    { label: "Browse Jobs", path: "/projects", icon: WorkOutlineIcon },
    { label: "My Proposals", path: "/proposals", icon: DescriptionOutlinedIcon },
    { label: "My Contracts", path: "/contracts", icon: HandshakeRoundedIcon },
    { label: "Messages", path: "/messages", icon: ChatBubbleOutlineIcon },
    { label: "Earnings", path: "/earnings", icon: PaidRoundedIcon },
    { label: "Settings", path: "/settings", icon: SettingsOutlinedIcon },
  ],

  employer: [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Profile", path: "/profile", icon: PersonRoundedIcon },
    { label: "My Projects", path: "/my-projects", icon: WorkOutlineIcon },
    { label: "My Contracts", path: "/contracts", icon: HandshakeRoundedIcon },
    { label: "Messages", path: "/messages", icon: ChatBubbleOutlineIcon },
    { label: "Payments", path: "/payments", icon: PaidRoundedIcon },
    { label: "Settings", path: "/settings", icon: SettingsOutlinedIcon },
  ],
};
