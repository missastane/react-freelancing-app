
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

    const isActiveGroup = items.some(
        (item) =>
            location.pathname === item.to ||
            location.pathname.startsWith(`${item.to}/`)
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
                    minHeight: 40,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    mb: 0.35,
                    color: isActiveGroup ? "primary.main" : "text.primary",
                    bgcolor: isActiveGroup
                        ? "action.hover"
                        : "transparent",
                    transition: "all 0.18s ease",

                    "&:hover": {
                        bgcolor: "action.hover",
                    },

                    "& .MuiListItemIcon-root": {
                        minWidth: 34,
                        color: "inherit",
                        "& .MuiSvgIcon-root": {
                            fontSize: 19,
                        },
                    },

                    "& .MuiListItemText-primary": {
                        fontSize: "0.84rem",
                        fontWeight: isActiveGroup ? 700 : 600,
                        lineHeight: 1.5,
                    },

                    "& .MuiSvgIcon-root": {
                        fontSize: 19,
                    },
                }}
            >
                <ListItemIcon>
                    {icon}
                </ListItemIcon>

                <ListItemText primary={label} />

                {open ? (
                    <ExpandLessRoundedIcon />
                ) : (
                    <ExpandMoreRoundedIcon />
                )}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    disablePadding
                    sx={{
                        ml: 2.1,
                        pl: 1,
                        borderLeft: 1,
                        borderColor: "divider",
                    }}
                >
                    {items.map((item) => (
                        <AdminNavItem
                            key={item.to}
                            {...item}
                            label={item.label}
                            sx={{
                                minHeight: 34,
                                pl: 1.5,
                                py: 0.35,
                                mb: 0.2,

                                "& .MuiListItemIcon-root": {
                                    minWidth: 30,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: 17,
                                    },
                                },

                                "& .MuiListItemText-primary": {
                                    fontSize: "0.78rem",
                                    fontWeight: 500,
                                },
                            }}
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
}
