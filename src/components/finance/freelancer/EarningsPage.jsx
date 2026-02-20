import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import FinancialLayout from "../shared/FinancialLayout";
import SectionCard from "../../dashboard/shared/SectionCard";
import KpiCard from "../../dashboard/shared/KpiCard";

/** چارت خیلی سبک (mock) */
function EarningsChartMock() {
  const theme = useTheme();
  const points = "0,78 25,70 50,58 75,62 100,50 125,42 150,30";

  return (
    <Box
      sx={{
        height: 220,
        borderRadius: 3,
        border: `1px solid ${theme.palette.surface?.border || theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        p: 2,
        overflow: "hidden",
        color: theme.palette.primary.main,
      }}
    >
      <svg viewBox="0 0 150 100" width="100%" height="100%" preserveAspectRatio="none">
        <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} />
        <polygon points={`${points} 150,100 0,100`} fill="currentColor" opacity="0.14" />
      </svg>
    </Box>
  );
}

function typeChip(theme, type) {
  const map = {
    income: "Income",
    withdrawal: "Withdrawal",
    commission: "Platform fee",
    subscription: "Subscription",
    refund: "Refund/Adjustment",
  };

  return (
    <Chip
      size="small"
      label={map[type] || type}
      sx={{
        borderRadius: 999,
        fontWeight: 900,
        bgcolor: theme.palette.action.selected,
        border: "1px solid",
        borderColor: theme.palette.surface?.border || theme.palette.divider,
      }}
    />
  );
}

function statusChip(theme, status) {
  const map = {
    available: "Available",
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
  };

  return (
    <Chip
      size="small"
      label={map[status] || status}
      sx={{
        borderRadius: 999,
        fontWeight: 900,
        bgcolor: theme.palette.action.selected,
        border: "1px solid",
        borderColor: theme.palette.surface?.border || theme.palette.divider,
      }}
    />
  );
}

export default function EarningsPage() {
  const theme = useTheme();

  // Mock transactions (بعداً از API)
  const rows = useMemo(
    () => [
      {
        id: 1,
        date: "2026-02-19",
        description: "Milestone payment — Build a Landing Page",
        project: "Build a Landing Page",
        type: "income",
        amount: 300,
        status: "available",
      },
      {
        id: 2,
        date: "2026-02-18",
        description: "Platform fee",
        project: "Build a Landing Page",
        type: "commission",
        amount: -30,
        status: "paid",
      },
      {
        id: 3,
        date: "2026-02-15",
        description: "Pro subscription — monthly",
        project: "Subscription",
        type: "subscription",
        amount: -12,
        status: "paid",
      },
      {
        id: 4,
        date: "2026-02-12",
        description: "Withdrawal to bank account",
        project: "Withdrawal",
        type: "withdrawal",
        amount: -250,
        status: "processing",
      },
      {
        id: 5,
        date: "2026-02-08",
        description: "Hourly payment — Fix Laravel API Bugs",
        project: "Fix Laravel API Bugs",
        type: "income",
        amount: 450,
        status: "pending",
      },
      {
        id: 6,
        date: "2026-02-04",
        description: "Refund/adjustment",
        project: "Adjustment",
        type: "refund",
        amount: 20,
        status: "paid",
      },
    ],
    []
  );

  // Filters (UI-only)
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [range, setRange] = useState("30d");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQuery =
        !query ||
        r.description.toLowerCase().includes(query) ||
        r.project.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query);

      const matchType = type === "all" ? true : r.type === type;

      // range is mock (no real date math here)
      const matchRange = true;

      return matchQuery && matchType && matchRange;
    });
  }, [rows, q, type, range]);

  // KPI mock values
  const available = "$1,180";
  const pending = "$450";
  const fees = "$42";
  const net = "$1,588";

  const kpis = (
    <>
      <KpiCard
        icon={<AccountBalanceWalletRoundedIcon />}
        label="Available"
        value={available}
        hint="Ready to withdraw"
        to="/earnings"
      />
      <KpiCard
        icon={<HourglassBottomRoundedIcon />}
        label="Pending"
        value={pending}
        hint="In review / escrow"
        to="/earnings?type=income"
      />
      <KpiCard
        icon={<ReceiptLongRoundedIcon />}
        label="Fees & Subscriptions"
        value={fees}
        hint="This month"
        to="/earnings?type=commission"
      />
      <KpiCard
        icon={<SavingsRoundedIcon />}
        label="Net Earnings"
        value={net}
        hint="Last 30 days"
        to="/earnings"
      />
    </>
  );

  const chart = (
    <SectionCard
      title="Earnings Overview"
      action={
        <Button
          size="small"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ fontWeight: 900, textTransform: "none" }}
          disabled
        >
          View report
        </Button>
      }
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <EarningsChartMock />
      <Divider sx={{ my: 2, borderColor: "divider" }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            Available
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{available}</Typography>
        </Box>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            Pending
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{pending}</Typography>
        </Box>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            Fees & subscriptions
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{fees}</Typography>
        </Box>
      </Box>
    </SectionCard>
  );

  const side = (
    <SectionCard
      title="Withdraw"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Stack spacing={1.2}>
        <Button
          variant="contained"
          sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          fullWidth
          disabled
        >
          Withdraw funds
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            fontWeight: 900,
            textTransform: "none",
            borderColor: theme.palette.surface?.border || theme.palette.divider,
          }}
          fullWidth
          disabled
        >
          Add payout method
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            fontWeight: 900,
            textTransform: "none",
            borderColor: theme.palette.surface?.border || theme.palette.divider,
          }}
          fullWidth
          disabled
        >
          Download statement
        </Button>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "divider" }} />

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        Here you can track income, platform fees, and subscriptions. This page is UI-only for now.
      </Typography>
    </SectionCard>
  );

  const filters = (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
      <TextField
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search description / project / type…"
        size="small"
        fullWidth
      />

      <TextField
        select
        size="small"
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ minWidth: { xs: "100%", md: 220 } }}
        label="Type"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="commission">Platform fee</MenuItem>
        <MenuItem value="subscription">Subscription</MenuItem>
        <MenuItem value="withdrawal">Withdrawal</MenuItem>
        <MenuItem value="refund">Refund/Adjustment</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        sx={{ minWidth: { xs: "100%", md: 180 } }}
        label="Range"
      >
        <MenuItem value="7d">Last 7 days</MenuItem>
        <MenuItem value="30d">Last 30 days</MenuItem>
        <MenuItem value="90d">Last 90 days</MenuItem>
        <MenuItem value="all">All time</MenuItem>
      </TextField>

      <Button
        variant="outlined"
        sx={{
          borderRadius: 2.5,
          fontWeight: 900,
          textTransform: "none",
          borderColor: theme.palette.surface?.border || theme.palette.divider,
          whiteSpace: "nowrap",
        }}
        onClick={() => {
          setQ("");
          setType("all");
          setRange("30d");
        }}
      >
        Reset
      </Button>
    </Stack>
  );

  const table = (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: "transparent",
        backgroundImage: "none",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Project</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 900 }} align="right">
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 900 }} align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>{r.date}</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>{r.description}</TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 800 }}>{r.project}</TableCell>
              <TableCell>{typeChip(theme, r.type)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 900 }}>
                {r.amount < 0 ? `-$${Math.abs(r.amount)}` : `$${r.amount}`}
              </TableCell>
              <TableCell>{statusChip(theme, r.status)}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="contained"
                  disabled
                  sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No results.
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <FinancialLayout
      title="Earnings"
      subtitle="Track income, fees, subscriptions, and withdrawals."
      primaryAction={
        <Button
          variant="contained"
          sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          disabled
        >
          Withdraw
        </Button>
      }
      secondaryAction={
        <Button
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            fontWeight: 900,
            textTransform: "none",
            borderColor: theme.palette.surface?.border || theme.palette.divider,
          }}
          disabled
        >
          Payout settings
        </Button>
      }
      kpis={kpis}
      chart={chart}
      side={side}
      filters={filters}
      table={table}
    />
  );
}