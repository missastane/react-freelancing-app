import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AdminNavItem({ to, icon, label }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        "&.active": {
          bgcolor: "surface.soft",
          border: 1,
          borderColor: "surface.borderTint",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}