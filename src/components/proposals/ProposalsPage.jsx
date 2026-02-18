import React, { useMemo, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const STATUS = {
  pending: { label: "Pending", icon: <AccessTimeIcon fontSize="small" /> },
  accepted: { label: "Accepted", icon: <CheckCircleOutlineIcon fontSize="small" /> },
  rejected: { label: "Rejected", icon: <HighlightOffIcon fontSize="small" /> },
  paused: { label: "Paused", icon: <PauseCircleOutlineIcon fontSize="small" /> }, // optional
};

// ✅ فعلاً mock — بعداً وصلش کن به API
const mockProposals = [
  {
    id: 1,
    status: "pending",
    jobTitle: "Landing Page in React + MUI",
    budget: 350,
    createdAt: "2026-02-12",
    coverLetterPreview: "I can build a clean, responsive landing page with MUI...",
    employerName: "Acme Studio",
  },
  {
    id: 2,
    status: "accepted",
    jobTitle: "Laravel API + JWT Auth",
    budget: 900,
    createdAt: "2026-02-09",
    coverLetterPreview: "I have solid experience in Laravel 11 and API design...",
    employerName: "Nova Team",
  },
  {
    id: 3,
    status: "rejected",
    jobTitle: "Bugfixing a marketplace checkout",
    budget: 200,
    createdAt: "2026-02-08",
    coverLetterPreview: "I can fix the checkout flow and add tests for edge cases...",
    employerName: "Shopify Dev",
  },
  {
    id: 4,
    status: "pending",
    jobTitle: "Chat system (WebSocket / Pusher)",
    budget: 650,
    createdAt: "2026-02-13",
    coverLetterPreview: "I already built a chat system with private channels and statuses...",
    employerName: "Wave Inc",
  },
];

function a11yProps(index) {
  return { id: `proposal-tab-${index}`, "aria-controls": `proposal-tabpanel-${index}` };
}

function StatusChip({ status }) {
  const meta = STATUS[status] ?? { label: status, icon: null };
  const theme = useTheme();
  const colorMap = {
    accepted: "success",
    rejected: "error",
    pending: "warning",
    paused: "default",
  };

  return (
    <Chip
      size="small"
      icon={meta.icon}
      label={meta.label}
      color={colorMap[status] ?? "default"}
      variant="outlined"
      sx={{ borderColor: theme.palette.surface.border }}
    />
  );
}

function ProposalCard({ proposal }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: theme.palette.surface.border,
        borderRadius: 3,
        overflow: "hidden",
        background: `linear-gradient(180deg,${theme.palette.primary.main}0D, transparent)`,
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800 }} noWrap title={proposal.jobTitle}>
              {proposal.jobTitle}
            </Typography>

            <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 0.6, flexWrap: "wrap" }}>
              <StatusChip status={proposal.status} />

              <Chip
                size="small"
                variant="outlined"
                icon={<WorkOutlineIcon fontSize="small" />}
                label={proposal.employerName}
                sx={{ borderColor: theme.palette.surface.border }}
              />

              <Chip
                size="small"
                variant="outlined"
                label={`$${proposal.budget}`}
                sx={{ borderColor: theme.palette.surface.border }}
              />

              <Chip
                size="small"
                variant="outlined"
                label={proposal.createdAt}
                sx={{ borderColor: theme.palette.surface.border }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }} noWrap>
              {proposal.coverLetterPreview}
            </Typography>
          </Box>

          <Stack direction="row" gap={1} flexShrink={0}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.surface.border,
                borderRadius: 2,
                "&:hover": { borderColor: theme.palette.surface.borderTint },
              }}
              onClick={() => navigate(`/proposals/${proposal.id}/${slugify(proposal.jobTitle)}`)}
            >
              View
            </Button>

            {proposal.status === "pending" && (
              <Button
                size="small"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
                onClick={() => console.log("Withdraw proposal:", proposal.id)}
              >
                Withdraw
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ProposalsPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");

  const tabs = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "pending", label: "Pending" },
      { key: "accepted", label: "Accepted" },
      { key: "rejected", label: "Rejected" },
      // اگر دوست داشتی:
      // { key: "paused", label: "Paused" },
    ],
    []
  );

  const counts = useMemo(() => {
    const c = { all: mockProposals.length };
    for (const p of mockProposals) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const currentKey = tabs[tab]?.key ?? "all";

    return mockProposals
      .filter((p) => (currentKey === "all" ? true : p.status === currentKey))
      .filter((p) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return p.jobTitle.toLowerCase().includes(q) || p.employerName.toLowerCase().includes(q);
      });
  }, [tab, query, tabs]);
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        bgcolor: theme.palette.surface.soft, // ✅ بک‌گراند صفحه از تم جدید
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22 }}>My Proposals</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your sent proposals by status.
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search by job or employer…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 360 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* Tabs */}
      <Box
        sx={{
          mt: 2,
          border: `1px solid ${theme.palette.surface.border}`,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 800,
              minHeight: 56,
            },
            "& .MuiTabs-indicator": {
              height: 3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {tabs.map((t, idx) => (
            <Tab
              key={t.key}
              label={
                <Stack direction="row" gap={1} alignItems="center">
                  <span>{t.label}</span>
                  <Chip
                    size="small"
                    label={counts[t.key] ?? 0}
                    sx={{
                      height: 20,
                      fontSize: 12,
                      borderRadius: 999,
                      backgroundColor: tab === idx ? theme.palette.surface.strong : "transparent",
                      border: `1px solid ${theme.palette.surface.border}`,
                    }}
                  />
                </Stack>
              }
              {...a11yProps(idx)}
              sx={{
                borderRadius: 2,
                mx: 0.5,
                ...(tab === idx ? { backgroundColor: theme.palette.surface.strong } : null),
              }}
            />
          ))}
        </Tabs>

        <Divider sx={{ borderColor: theme.palette.surface.border }} />

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography sx={{ fontWeight: 900 }}>No proposals found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
                Try changing the tab or search query.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.4}>
              {filtered.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
