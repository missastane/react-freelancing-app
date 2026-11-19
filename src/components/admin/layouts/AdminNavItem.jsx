
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AdminNavItem({
    to,
    icon,
    label,
    end = false,
    sx = {},
}) {
    return (
        <ListItemButton
            component={NavLink}
            to={to}
            end={end}
            sx={{
                minHeight: 38,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                mb: 0.35,
                color: "text.secondary",
                transition: "all 0.18s ease",

                "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                },

                "&.active": {
                    bgcolor: "action.selected",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                        color: "primary.main",
                    },
                    "& .MuiListItemText-primary": {
                        fontWeight: 700,
                    },
                },

                "& .MuiListItemIcon-root": {
                    minWidth: 34,
                    color: "inherit",
                    "& .MuiSvgIcon-root": {
                        fontSize: 19,
                    },
                },

                "& .MuiListItemText-primary": {
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    lineHeight: 1.5,
                },

                ...sx,
            }}
        >
            <ListItemIcon>
                {icon}
            </ListItemIcon>

            <ListItemText primary={label} />
        </ListItemButton>
    );
}
