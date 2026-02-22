import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SettingsSectionHeader from "./SettingsSectionHeader";
import { useRole } from "../../../context/RoleContext";

function SurfaceBox({ children, sx }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
        p: 1.25,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function SeverityChip({ severity }) {
  // severity: info | warning | critical
  const theme = useTheme();
  const label =
    severity === "critical"
      ? "Critical"
      : severity === "warning"
      ? "Warning"
      : "Info";

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
      }}
    />
  );
}

function TypeChip({ type }) {
  const map = {
    auth: "Auth",
    security: "Security",
    notifications: "Notifications",
    profile: "Profile",
    payments: "Payments",
    projects: "Projects",
    messages: "Messages",
  };
  return <Chip size="small" label={map[type] ?? type} />;
}

function formatDateTime(iso) {
  // UI-only simple formatting
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function ActivityLogSettings() {
  const theme = useTheme();
  const { activeRole } = useRole();

  // UI-only dataset
  const rows = React.useMemo(() => {
    const common = [
      {
        id: "evt_01",
        ts: "2026-02-22T10:15:00Z",
        type: "auth",
        severity: "info",
        action: "Signed in",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "New session created",
      },
      {
        id: "evt_02",
        ts: "2026-02-22T10:18:00Z",
        type: "security",
        severity: "warning",
        action: "Password changed",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "Security-sensitive change",
      },
      {
        id: "evt_03",
        ts: "2026-02-21T20:05:00Z",
        type: "notifications",
        severity: "info",
        action: "Notification preferences updated",
        ip: "91.20.7.3",
        device: "Safari · iPhone",
        meta: "Channels + categories",
      },
      {
        id: "evt_04",
        ts: "2026-02-20T13:44:00Z",
        type: "messages",
        severity: "info",
        action: "New conversation started",
        ip: "91.20.7.3",
        device: "Safari · iPhone",
        meta: "Direct message",
      },
      {
        id: "evt_05",
        ts: "2026-02-19T09:01:00Z",
        type: "security",
        severity: "critical",
        action: "2FA disabled",
        ip: "203.0.113.9",
        device: "Unknown device",
        meta: "Requires review",
      },
    ];

    const freelancer = [
      {
        id: "evt_f_01",
        ts: "2026-02-21T11:30:00Z",
        type: "projects",
        severity: "info",
        action: "Applied to a project",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "Proposal submitted",
      },
      {
        id: "evt_f_02",
        ts: "2026-02-18T16:12:00Z",
        type: "profile",
        severity: "info",
        action: "Profile visibility changed",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "Public → Platform users",
      },
      {
        id: "evt_f_03",
        ts: "2026-02-17T14:05:00Z",
        type: "payments",
        severity: "info",
        action: "Payout method updated",
        ip: "91.20.7.3",
        device: "Safari · iPhone",
        meta: "Bank details",
      },
    ];

    const employer = [
      {
        id: "evt_e_01",
        ts: "2026-02-21T12:05:00Z",
        type: "projects",
        severity: "info",
        action: "Project created",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "New job posted",
      },
      {
        id: "evt_e_02",
        ts: "2026-02-20T17:55:00Z",
        type: "payments",
        severity: "info",
        action: "Invoice downloaded",
        ip: "185.44.12.10",
        device: "Chrome · Windows",
        meta: "PDF receipt",
      },
      {
        id: "evt_e_03",
        ts: "2026-02-18T08:40:00Z",
        type: "profile",
        severity: "info",
        action: "Company profile updated",
        ip: "91.20.7.3",
        device: "Safari · iPhone",
        meta: "Logo + description",
      },
    ];

    return [...(activeRole === "freelancer" ? freelancer : employer), ...common].sort(
      (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
  }, [activeRole]);

  // Filters
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("all");
  const [severity, setSeverity] = React.useState("all");

  // Pagination
  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQuery =
        !q ||
        r.action.toLowerCase().includes(q) ||
        r.device.toLowerCase().includes(q) ||
        r.ip.toLowerCase().includes(q) ||
        (r.meta || "").toLowerCase().includes(q);

      const matchType = type === "all" || r.type === type;
      const matchSeverity = severity === "all" || r.severity === severity;

      return matchQuery && matchType && matchSeverity;
    });
  }, [rows, query, type, severity]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  React.useEffect(() => {
    // Reset page when filters change
    setPage(1);
  }, [query, type, severity, activeRole]);

  const surfaceCard = {
    borderColor: theme.palette.surface?.border ?? "divider",
    borderRadius: 3,
    backgroundImage: "none",
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore (UI-only)
    }
  };

  const typeOptions = [
    { value: "all", label: "All types" },
    { value: "auth", label: "Auth" },
    { value: "security", label: "Security" },
    { value: "notifications", label: "Notifications" },
    { value: "profile", label: "Profile" },
    { value: "payments", label: "Payments" },
    { value: "projects", label: "Projects" },
    { value: "messages", label: "Messages" },
  ];

  const severityOptions = [
    { value: "all", label: "All severities" },
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "critical", label: "Critical" },
  ];

  return (
    <Box>
      <SettingsSectionHeader
        title="Activity log"
        subtitle="Review recent security and account activity."
        right={
          <Chip
            size="small"
            label={activeRole === "freelancer" ? "Freelancer view" : "Employer view"}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
              backgroundColor: theme.palette.surface?.soft ?? "transparent",
            }}
          />
        }
      />

      <Stack spacing={2}>
        {/* Hint */}
        <SurfaceBox>
          <Typography variant="body2" color="text.secondary">
            If you see something unusual (unknown device, IP, or critical events), change your password
            and enable 2FA in <b>Security</b>.
          </Typography>
        </SurfaceBox>

        {/* Filters */}
        <Paper variant="outlined" sx={{ ...surfaceCard }}>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.25}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search (action, device, IP, ...)"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flexShrink: 0 }}>
                <Select size="small" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 160 }}>
                  {typeOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  size="small"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  sx={{ minWidth: 170 }}
                >
                  {severityOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>

                <Button variant="outlined" onClick={() => { setQuery(""); setType("all"); setSeverity("all"); }}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Device</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>IP</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="right">
                    Meta
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No activity found for the selected filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDateTime(r.ts)}</TableCell>
                      <TableCell>
                        <TypeChip type={r.type} />
                      </TableCell>
                      <TableCell>
                        <SeverityChip severity={r.severity} />
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <Typography sx={{ fontWeight: 700 }}>{r.action}</Typography>
                        {r.meta ? (
                          <Typography variant="body2" color="text.secondary">
                            {r.meta}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{r.device}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                          <Typography variant="body2">{r.ip}</Typography>
                          <Tooltip title="Copy IP">
                            <IconButton size="small" onClick={() => copy(r.ip)}>
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="text" size="small">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          {/* Footer */}
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing <b>{paged.length}</b> of <b>{filtered.length}</b> results
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                shape="rounded"
              />
            </Stack>
          </Box>
        </Paper>

        {/* UI-only action */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined">Export</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>
      </Stack>
    </Box>
  );
}