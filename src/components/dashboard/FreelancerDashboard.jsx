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

import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import KpiCard from "./shared/KpiCard";
import SectionCard from "./shared/SectionCard";

/** یه چارت خیلی سبک شبیه mock (بدون recharts) */
function EarningsChartMock() {
  const points = "0,90 25,65 50,66 75,45 100,55 125,25 150,40";

  return (
    <Box
      sx={(t) => ({
        height: 180,
        borderRadius: 3,
        border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
        background: t.palette.background.paper,
        p: 2,
        overflow: "hidden",
        color: t.palette.success?.main || t.palette.primary.main,
      })}
    >
      <svg viewBox="0 0 150 100" width="100%" height="100%" preserveAspectRatio="none">
        <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} />
        <polygon points={`${points} 150,100 0,100`} fill="currentColor" opacity="0.18" />
      </svg>
    </Box>
  );
}

export default function FreelancerDashboard() {
  const theme = useTheme();

  const activeProjects = [
    { title: "Website Redesign", status: "In Progress", due: "June 25", amount: "$1200" },
    { title: "Mobile App Development", status: "In Review", due: "June 20", amount: "$800" },
    { title: "Logo Design", status: "Draft", due: "June 15", amount: "$500" },
  ];

  const recentProposals = [
    { title: "E-commerce Site Setup", state: "Pending" },
    { title: "Social Media Marketing", state: "Viewed" },
    { title: "Content Writing Task", state: "Shortlisted" },
  ];

  const recentMessages = [
    { from: "Client A", text: "Please send the latest draft.", time: "10 min ago" },
    { from: "Client B", text: "Can we have a quick call?", time: "1 hour ago" },
    { from: "Project Manager", text: "Update me on the progress.", time: "3 hours ago" },
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
              Here’s an overview of your freelance activity.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.2} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
            <Button
              variant="contained"
              href="/projects"
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Find Projects
            </Button>
            <Button
              variant="outlined"
              href="/messages"
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Inbox
            </Button>
          </Stack>
        </Stack>

        {/* ✅ Row 1: KPI (4 / 2 / 1) */}
        <Box sx={rowSx}>
          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<WorkOutlineRoundedIcon />}
              label="Active Projects"
              value="3"
              hint="Ongoing contracts"
              href="/projects"
              trend={{ label: "", value: "+5%" }}
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<SendRoundedIcon />}
              label="Pending Proposals"
              value="5"
              hint="Awaiting response"
              href="/proposals"
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<PaidRoundedIcon />}
              label="This Month’s Earnings"
              value="$2,450"
              hint="View details"
              href="/earnings"
            />
          </Box>

          <Box sx={kpiWrapSx}>
            <KpiCard
              icon={<MailOutlineRoundedIcon />}
              label="Unread Messages"
              value="4"
              hint="Check inbox"
              href="/messages"
            />
          </Box>
        </Box>

        {/* ✅ Row 2: 2 columns (ratio 1.55 / 0.9) */}
        <Box sx={{ ...rowSx, mt: 2 }}>
          <Box sx={row2LeftWrapSx}>
            <SectionCard
              title="Earnings Overview"
              action={
                <Button
                  size="small"
                  href="/earnings"
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
              <EarningsChartMock />

              <Divider sx={{ my: 2, borderColor: "divider" }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Earnings
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>$12,300</Typography>
                </Box>

                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    In Progress
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>$1,500</Typography>
                </Box>

                <Box sx={{ flex: "1 1 140px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Available
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>$3,200</Typography>
                </Box>
              </Box>
            </SectionCard>
          </Box>

          <Box sx={row2RightWrapSx}>
            <SectionCard
              title="My Active Projects"
              action={
                <Button
                  size="small"
                  href="/projects"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
                >
                  View all
                </Button>
              }
              sx={{ width: "100%", height: "100%" }}
            >
              <List disablePadding>
                {activeProjects.map((p) => (
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

                    <Typography sx={{ fontWeight: 900 }}>{p.amount}</Typography>
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
                  href="/proposals"
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
              title="New Messages"
              action={
                <Button
                  size="small"
                  href="/messages"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 900, textTransform: "none" }}
                >
                  Go to inbox
                </Button>
              }
              sx={{ width: "100%", height: "100%" }}
            >
              <List disablePadding>
                {recentMessages.map((m, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 1.1, gap: 1.2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>{m.from[0]}</Avatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 900 }}>{m.from}</Typography>}
                      secondary={m.text}
                    />
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
