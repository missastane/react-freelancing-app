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
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import FinancialLayout from "../shared/FinancialLayout";
import SectionCard from "../../dashboard/shared/SectionCard";
import KpiCard from "../../dashboard/shared/KpiCard";

/** چارت خیلی سبک (mock) */
function SpendChartMock() {
  const theme = useTheme();
  const points = "0,70 25,60 50,65 75,55 100,50 125,38 150,45";

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

function statusChip(theme, status) {
  const map = {
    paid: { label: "Paid" },
    escrow: { label: "In Escrow" },
    pending: { label: "Pending" },
    failed: { label: "Failed" },
    refunded: { label: "Refunded" },
  };
  const meta = map[status] || { label: status };

  return (
    <Chip
      size="small"
      label={meta.label}
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

export default function PaymentsPage() {
  const theme = useTheme();

  // Mock data (بعداً از API)
  const rows = useMemo(
    () => [
      {
        id: 1,
        date: "2026-02-18",
        project: "Build a Landing Page",
        counterparty: "JaneDesigns",
        type: "Milestone",
        amount: 300,
        status: "escrow",
      },
      {
        id: 2,
        date: "2026-02-14",
        project: "Fix Laravel API Bugs",
        counterparty: "DevMaster",
        type: "Hourly",
        amount: 450,
        status: "pending",
      },
      {
        id: 3,
        date: "2026-02-10",
        project: "Design a Logo Set",
        counterparty: "PixelPro",
        type: "Fixed",
        amount: 120,
        status: "paid",
      },
      {
        id: 4,
        date: "2026-02-07",
        project: "UI Audit",
        counterparty: "UXGuru",
        type: "Fixed",
        amount: 220,
        status: "failed",
      },
      {
        id: 5,
        date: "2026-02-02",
        project: "Shop Setup",
        counterparty: "EcomPro",
        type: "Fixed",
        amount: 180,
        status: "refunded",
      },
    ],
    []
  );

  // Filters (UI-only)
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("30d");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQuery =
        !query ||
        r.project.toLowerCase().includes(query) ||
        r.counterparty.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query);

      const matchStatus = status === "all" ? true : r.status === status;

      // range is mock (no real date math here)
      const matchRange = true;

      return matchQuery && matchStatus && matchRange;
    });
  }, [rows, q, status, range]);

  // KPI mock
  const totalSpend = "$8,420";
  const inEscrow = "$1,180";
  const pending = "$450";
  const issues = "2";

  const kpis = (
    <>
      <KpiCard
        icon={<PaidRoundedIcon />}
        label="Total Spend"
        value={totalSpend}
        hint="All-time"
        to="/payments"
      />
      <KpiCard
        icon={<AccountBalanceWalletRoundedIcon />}
        label="In Escrow"
        value={inEscrow}
        hint="Held funds"
        to="/payments"
      />
      <KpiCard
        icon={<HourglassBottomRoundedIcon />}
        label="Pending Releases"
        value={pending}
        hint="Awaiting action"
        to="/payments?status=pending"
      />
      <KpiCard
        icon={<ReplayRoundedIcon />}
        label="Issues"
        value={issues}
        hint="Failed / refunded"
        to="/payments?status=failed"
      />
    </>
  );

  const chart = (
    <SectionCard
      title="Spend Overview"
      action={
        <Button
          size="small"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ fontWeight: 900, textTransform: "none" }}
          disabled
        >
          View details
        </Button>
      }
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpendChartMock />
      <Divider sx={{ my: 2, borderColor: "divider" }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            Total spend
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{totalSpend}</Typography>
        </Box>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            In escrow
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{inEscrow}</Typography>
        </Box>
        <Box sx={{ flex: "1 1 160px" }}>
          <Typography variant="caption" color="text.secondary">
            Pending releases
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{pending}</Typography>
        </Box>
      </Box>
    </SectionCard>
  );

  const side = (
    <SectionCard
      title="Quick Actions"
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
          Add payment method
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
          Release escrow
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
          Download invoice
        </Button>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "divider" }} />

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        This page is UI-only for now. Later we’ll connect it to billing, escrow, and invoices APIs.
      </Typography>
    </SectionCard>
  );

  const filters = (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
      <TextField
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search project / freelancer / type…"
        size="small"
        fullWidth
      />

      <TextField
        select
        size="small"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{ minWidth: { xs: "100%", md: 200 } }}
        label="Status"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="paid">Paid</MenuItem>
        <MenuItem value="escrow">In Escrow</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="failed">Failed</MenuItem>
        <MenuItem value="refunded">Refunded</MenuItem>
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
          setStatus("all");
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
            <TableCell sx={{ fontWeight: 900 }}>Project</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Freelancer</TableCell>
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
              <TableCell sx={{ fontWeight: 900 }}>{r.project}</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>{r.counterparty}</TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>{r.type}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 900 }}>
                ${r.amount}
              </TableCell>
              <TableCell>{statusChip(theme, r.status)}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="contained"
                  disabled
                  sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                >
                  Manage
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
      title="Payments"
      subtitle="Track spend, escrow, and payment history."
      primaryAction={
        <Button
          variant="contained"
          sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          disabled
        >
          Add funds
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
          Billing settings
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