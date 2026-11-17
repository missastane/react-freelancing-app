
import { useEffect, useState } from "react";
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useLocation } from "react-router-dom";

import AdminNavItem from "./AdminNavItem";

export default function AdminNavGroup({ label, icon, items }) {
    const location = useLocation();

    const isActiveGroup = items.some((item) =>
        location.pathname.startsWith(item.to)
    );

    const [open, setOpen] = useState(isActiveGroup);

    useEffect(() => {
        if (isActiveGroup) {
            setOpen(true);
        }
    }, [location.pathname, isActiveGroup]);

    return (
        <>
            <ListItemButton
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: isActiveGroup ? "action.selected" : "transparent",
                }}
            >
                <ListItemIcon sx={{ minWidth: 40 }}>
                    {icon}
                </ListItemIcon>

                <ListItemText primary={label} />

                {open ? (
                    <ExpandLessRoundedIcon fontSize="small" />
                ) : (
                    <ExpandMoreRoundedIcon fontSize="small" />
                )}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {items.map((item) => (
                        <AdminNavItem
                            key={item.to}
                            {...item}
                            label={item.label}
                            sx={{
                                pl: 4,
                            }}
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
}
