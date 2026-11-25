import * as React from "react";
import SecurityHintBox from "../shared/SecurityHintBox"
import SecuritySectionCard from "../shared/SecuritySectionCard"

import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useMediaQuery,

} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ActiveSessionsSection = () => {

    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [sessions, setSessions] = React.useState([
        {
            id: "sess_1",
            current: true,
            device: "Chrome · Windows",
            location: "Berlin, DE",
            ip: "185.44.12.10",
            lastActive: "Just now",
            createdAt: "2026-02-22 10:15",
        },
        {
            id: "sess_2",
            current: false,
            device: "Safari · iPhone",
            location: "Berlin, DE",
            ip: "91.20.7.3",
            lastActive: "2 hours ago",
            createdAt: "2026-02-21 20:05",
        },
        {
            id: "sess_3",
            current: false,
            device: "Unknown device",
            location: "—",
            ip: "203.0.113.9",
            lastActive: "3 days ago",
            createdAt: "2026-02-19 09:01",
            risky: true,
        },
    ]);
    const sessionCount = sessions.length;

    const openSignoutAll = () => {
        setConfirmSignout({ open: true, sessionId: null, all: true });
    };

    return (
        <SecuritySectionCard
            title="Active sessions"
            subtitle="Review signed-in devices and sign out of others."
            icon={<DevicesIcon fontSize="small" />}
            right={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Chip size="small" label={`${sessionCount} sessions`} />
                    <Button variant="outlined" color="warning" onClick={openSignoutAll}>
                        Sign out all
                    </Button>
                </Stack>
            }
        >
            <SecurityHintBox>
                <Typography variant="body2" color="text.secondary">
                    If you don’t recognize a session, sign out and change your password immediately.
                </Typography>
            </SecurityHintBox>

            <Box sx={{ height: 12 }} />

            <Paper
                variant="outlined"
                sx={{
                    borderColor: theme.palette.surface?.border ?? "divider",
                    borderRadius: 3,
                    backgroundImage: "none",
                    overflow: "hidden",
                }}
            >
                <TableContainer>
                    <Table size={isMdUp ? "medium" : "small"}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Device</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Last active</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>IP</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sessions.map((s) => (
                                <TableRow key={s.id} hover>
                                    <TableCell sx={{ minWidth: 200 }}>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                                            <Typography sx={{ fontWeight: 700 }}>{s.device}</Typography>
                                            {s.current ? <Chip size="small" label="This device" /> : null}
                                            {s.risky ? <Chip size="small" color="warning" label="Risky" /> : null}
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            Created: {s.createdAt}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>{s.location}</TableCell>

                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{s.lastActive}</TableCell>

                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                            <Typography variant="body2">{s.ip}</Typography>
                                            <Tooltip title="Copy IP">
                                                <IconButton size="small" onClick={() => copy(s.ip)}>
                                                    <ContentCopyIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="right">
                                        {s.current ? (
                                            <Button size="small" variant="text" disabled>
                                                Active
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color={s.risky ? "warning" : "inherit"}
                                                onClick={() => openSignoutOne(s.id)}
                                            >
                                                Sign out
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </SecuritySectionCard>
    )
}

export default ActiveSessionsSection