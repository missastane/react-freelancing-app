import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import KpiCard from "./shared/KpiCard";
import SectionCard from "./shared/SectionCard";

/** چارت سبک (برای کارفرما مثلا: Spend / Hiring activity) */
function SpendChartMock() {
  const points = "0,80 25,70 50,55 75,60 100,40 125,30 150,45";

  return (
    <Box
      sx={(t) => ({
        height: 180,
        borderRadius: 3,
        border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
        background: t.palette.background.paper,
        p: 2,
        overflow: "hidden",
        color: t.palette.primary.main,
      })}
    >
      <svg viewBox="0 0 150 100" width="100%" height="100%" preserveAspectRatio="none">
        <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} />
        <polygon points={`${points} 150,100 0,100`} fill="currentColor" opacity="0.14" />
      </svg>
    </Box>
  );
}

export default function EmployerDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  // --- mock data (بعداً از API)
  const openJobs = [
    { title: "Build a Landing Page", status: "Open", due: "Mar 12", budget: "$300" },
    { title: "Fix Laravel API Bugs", status: "In Review", due: "Mar 18", budget: "$450" },
    { title: "Design a Logo Set", status: "Draft", due: "Mar 22", budget: "$120" },
  ];

  const recentProposals = [
    { title: "Landing Page — Proposal from JaneDesigns", state: "New" },
    { title: "Laravel Bugs — Proposal from DevMaster", state: "Shortlisted" },
    { title: "Logo Set — Proposal from PixelPro", state: "Viewed" },
  ];

  const recentMessages = [
    { from: "JaneDesigns", text: "I can start today, need access to assets.", time: "8 min ago" },
    { from: "DevMaster", text: "Sent a revised timeline for the API fixes.", time: "1 hour ago" },
    { from: "PixelPro", text: "Do you prefer modern or minimal logo style?", time: "4 hours ago" },
  ];

  // ✅ shared row wrapper (flex + equal height)
  const rowSx = {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "stretch",
    width: "100%",
  };

  // ✅ KPI wrapper (4 on desktop, 2 on tablet, 1 on mobile) + equal height + minWidth
  const kpiWrapSx = {
    flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", md: "1 1 0%" },
    minWidth: { xs: "100%", sm: 350, md: 270 },
    display: "flex",
  };

  // ✅ Row2 wrappers (ratio similar to MyProjectsPage) + equal height + minWidth
  const row2LeftWrapSx = {
    flex: { xs: "1 1 100%", md: "1.55 1 0%" },
    minWidth: { xs: "100%", md: 560 },
    display: "flex",
    alignItems: "stretch",
  };

  const row2RightWrapSx = {
    flex: { xs: "1 1 100%", md: "0.9 1 0%" },
    minWidth: { xs: "100%", md: 380 },
    display: "flex",
    alignItems: "stretch",
  };

  // ✅ Row3 wrappers (3 columns desktop, 1 column mobile) + equal height + minWidth
  const row3WrapSx = {
    flex: { xs: "1 1 100%", md: "1 1 0%" },
    minWidth: { xs: "100%", md: 320 },
    display: "flex",
    alignItems: "stretch",
  };

  const goCreateProject = () => {
    navigate("/my-projects?create=1", { state: { from: "dashboard" } });
  };

  const goMyProjects = () => navigate("/my-projects");

  const goMyProposals = () => {
    // ✅ proposals are shown inside /my-projects (query-driven)
    navigate("/my-projects?tab=proposals", { state: { from: "dashboard" } });
  };

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4 },
        overflowX: "hidden",
        bgcolor: theme.palette.surface?.soft || theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
              Dashboard
            </Typography>
            <Typography sx={{ mt: 0.75, fontWeight: 800 }}>
              Welcome back, John!
            </Typography>
            <Typography color="text.secondary">
              Here’s an overview of your hiring activity.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.2} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
            <Button
              variant="contained"
              onClick={goCreateProject}
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Post a Project
            </Button>
            <Button
              variant="outlined"
              onClick={goMyProposals}
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Review Proposals
            </Button>
          </Stack>
        </Stack>

        {/* ✅ Row 1: KPI (4 / 2 / 1) */}
        <Box sx={rowSx}>
          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<WorkOutlineRoundedIcon />}
              label="Open Projects"
              value="4"
              hint="Currently hiring"
              to="/my-projects"
              trend={{ label: "", value: "+2" }}
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<SendRoundedIcon />}
              label="New Proposals"
              value="12"
              hint="Awaiting review"
              to="/my-projects?tab=proposals"
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<PaidRoundedIcon />}
              label="Pending Payments"
              value="$1,180"
              hint="Release / manage"
              to="/payments"
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<MailOutlineRoundedIcon />}
              label="Unread Messages"
              value="6"
              hint="Check inbox"
              to="/messages"
            />
          </Box>
        </Box>

        {/* ✅ Row 2: 2 columns (ratio 1.55 / 0.9) */}
        <Box sx={{ ...rowSx, mt: 2 }}>
          <Box sx={row2LeftWrapSx}>
            <SectionCard
              title="Spend Overview"
              action={
                <Button
                  size="small"
                  component={RouterLink}
                  to="/payments"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
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
                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Spend
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>$8,420</Typography>
                </Box>

                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    In Escrow
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>$1,180</Typography>
                </Box>

                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Active Contracts
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>3</Typography>
                </Box>
              </Box>
            </SectionCard>
          </Box>

          <Box sx={row2RightWrapSx}>
            <SectionCard
              title="My Open Projects"
              action={
                <Button
                  size="small"
                  onClick={goMyProjects}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
                >
                  View all
                </Button>
              }
              sx={{ width: "100%", height: "100%" }}
            >
              <List disablePadding>
                {openJobs.map((p) => (
                  <ListItem
                    key={p.title}
                    disableGutters
                    sx={{ py: 1.2, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                          <Typography sx={{ fontWeight: 900 }}>{p.title}</Typography>
                          <Chip size="small" label={p.status} />
                        </Stack>
                      }
                      secondary={`Due: ${p.due}`}
                    />

                    <Typography sx={{ fontWeight: 900 }}>{p.budget}</Typography>
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Box>
        </Box>

        {/* ✅ Row 3: 3 columns */}
        <Box sx={{ ...rowSx, mt: 2 }}>
          <Box sx={row3WrapSx}>
            <SectionCard
              title="Recent Proposals"
              action={
                <Button
                  size="small"
                  onClick={goMyProposals}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
                >
                  Manage
                </Button>
              }
              sx={{ width: "100%", height: "100%" }}
            >
              <List disablePadding>
                {recentProposals.map((x) => (
                  <ListItem key={x.title} disableGutters sx={{ py: 1.1 }}>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 900 }}>{x.title}</Typography>}
                      secondary={x.state}
                    />
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Box>

          <Box sx={row3WrapSx}>
            <SectionCard title="New Messages" sx={{ width: "100%", height: "100%" }}>
              <List disablePadding>
                {recentMessages.map((m, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 1.1, gap: 1.2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>{m.from[0]}</Avatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" gap={1}>
                          <Typography sx={{ fontWeight: 900 }}>{m.from}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.time}
                          </Typography>
                        </Stack>
                      }
                      secondary={m.text}
                    />
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Box>

          <Box sx={row3WrapSx}>
            <SectionCard
              title="Quick Actions"
              action={
                <Button
                  size="small"
                  onClick={goCreateProject}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
                >
                  Create
                </Button>
              }
              sx={{ width: "100%", height: "100%" }}
            >
              <Stack spacing={1.2}>
                <Button
                  variant="contained"
                  onClick={goCreateProject}
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                  fullWidth
                >
                  Post a Project
                </Button>

                <Button
                  variant="outlined"
                  onClick={goMyProposals}
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                  fullWidth
                >
                  Review Proposals
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/contracts"
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                  fullWidth
                >
                  Manage Contracts
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/payments"
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                  fullWidth
                >
                  Payments
                </Button>
              </Stack>
            </SectionCard>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}