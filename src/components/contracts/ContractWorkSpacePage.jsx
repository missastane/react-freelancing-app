import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";

function statusChip(status) {
  if (status === "completed") return <Chip label="Completed" size="small" color="success" />;
  if (status === "dispute") return <Chip label="In Dispute" size="small" color="error" />;
  return <Chip label="Active" size="small" color="info" />;
}

function milestoneIcon(status) {
  if (status === "completed") return <CheckCircleRoundedIcon fontSize="small" color="success" />;
  if (status === "active") return <RadioButtonCheckedRoundedIcon fontSize="small" color="info" />;
  return <LockRoundedIcon fontSize="small" color="disabled" />;
}

function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString("en-US")}`;
}

export default function ContractWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState(0);

  // TODO: بعداً از API میاد (GET /contracts/:id)
  const contract = React.useMemo(() => {
    return {
      id: id || "—",
      title: "Website Redesign Project",
      status: "active",
      clientName: "Acme Inc.",
      freelancerName: "You",
      startDate: "Feb 1, 2026",
      dueDate: "Mar 1, 2026",
      budget: 1250,
      escrow: 750,
      paid: 500,
      pdfUrl: "#",
      milestones: [
        {
          id: "m1",
          title: "Design Landing Page",
          amount: 500,
          status: "completed",
          outputUrl: "#",
          paymentUrl: "#",
        },
        {
          id: "m2",
          title: "Implement UI",
          amount: 750,
          status: "active",
          note: "Working on the UI updates…",
        },
        {
          id: "m3",
          title: "QA & Delivery",
          amount: 0,
          status: "locked",
          note: "Locked until previous milestone completed.",
        },
      ],
      activity: [
        "Milestone 1 approved by Client",
        "You uploaded: wireframe_v3.pdf",
        "Payment of $500 released to you",
      ],
      messagesPreview: [
        { from: "Client", text: "Here is the initial draft for review." },
        { from: "You", text: "I’ll check this and get back to you soon." },
      ],
    };
  }, [id]);

  const progressPct = React.useMemo(() => {
    const total = contract.milestones.reduce((a, m) => a + (m.amount || 0), 0) || 1;
    const done = contract.milestones
      .filter((m) => m.status === "completed")
      .reduce((a, m) => a + (m.amount || 0), 0);
    return Math.round((done / total) * 100);
  }, [contract.milestones]);

  // ✅ مثل Dashboard: حداقل عرض برای ستون‌ها تا وسط صفحه کشیده و متمرکز بشن
  const rowSx = {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "stretch",
    width: "100%",
  };

  const mainWrapSx = {
    flex: { xs: "1 1 100%", md: "1.55 1 0%" },
    minWidth: { xs: "100%", md: 720 },
    display: "flex",
    alignItems: "stretch",
  };

  const sideWrapSx = {
    flex: { xs: "1 1 100%", md: "0.9 1 0%" },
    minWidth: { xs: "100%", md: 360 },
    display: "flex",
    alignItems: "stretch",
  };

  return (
    <Box
      sx={(theme) => ({
        py: { xs: 3, sm: 4 },
        bgcolor: theme.palette.surface?.soft || theme.palette.background.default,
        minHeight: "100vh",
      })}
    >
      {/* ✅ Header full width (fluid) */}
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Card
          sx={(t) => ({
            width: "100%",
            borderRadius: 3,
            border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
            boxShadow: "none",
          })}
        >
          <CardContent sx={{ py: 2.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
              <Stack direction="row" alignItems="center" gap={1.5}>
                <IconButton onClick={() => navigate(-1)} size="small">
                  <ArrowBackRoundedIcon />
                </IconButton>

                <Stack>
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Contract #{contract.id}: {contract.title}
                    </Typography>
                    {statusChip(contract.status)}
                  </Stack>

                  <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Client: <b>{contract.clientName}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Freelancer: <b>{contract.freelancerName}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start: <b>{contract.startDate}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due: <b>{contract.dueDate}</b>
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack alignItems="flex-end" gap={1} sx={{ minWidth: 260 }}>
                <Button variant="text" startIcon={<DescriptionRoundedIcon />} href={contract.pdfUrl}>
                  View Contract PDF
                </Button>

                <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="flex-end">
                  <Chip size="small" label={`Budget: ${formatMoney(contract.budget)}`} />
                  <Chip size="small" label={`Escrow: ${formatMoney(contract.escrow)}`} />
                  <Chip size="small" label={`Paid: ${formatMoney(contract.paid)}`} />
                </Stack>

                <Box sx={{ width: "100%" }}>
                  <LinearProgress variant="determinate" value={progressPct} />
                  <Typography variant="caption" color="text.secondary">
                    {progressPct}% completed
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* ✅ Body centered & wider (xl) */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Tabs */}
        <Box sx={{ mt: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Overview" />
            <Tab label="Milestones" />
            <Tab label="Messages" />
            <Tab label="Files" />
            <Tab label="Dispute" />
          </Tabs>
        </Box>

        {/* Body (center + stretched) */}
        <Box sx={{ ...rowSx, mt: 2 }}>
          {/* Main */}
          <Box sx={mainWrapSx}>
            <Box sx={{ width: "100%" }}>
              {tab === 0 && (
                <Stack spacing={2}>
                  {/* Milestones */}
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                        Milestones
                      </Typography>

                      <Stack spacing={1}>
                        {contract.milestones.map((m) => (
                          <Paper
                            key={m.id}
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              opacity: m.status === "locked" ? 0.65 : 1,
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="flex-start"
                              justifyContent="space-between"
                              gap={2}
                              flexWrap="wrap"
                            >
                              <Stack direction="row" gap={1.25} alignItems="flex-start" sx={{ minWidth: 260, flex: 1 }}>
                                <Box sx={{ mt: 0.2 }}>{milestoneIcon(m.status)}</Box>

                                <Box sx={{ minWidth: 0 }}>
                                  <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                                    <Typography sx={{ fontWeight: 800 }}>{m.title}</Typography>
                                    <Chip size="small" label={formatMoney(m.amount)} />

                                    {m.status === "completed" && (
                                      <Chip size="small" color="success" label="Completed & Paid" />
                                    )}
                                    {m.status === "active" && <Chip size="small" color="info" label="In progress" />}
                                    {m.status === "locked" && <Chip size="small" label="Locked" />}
                                  </Stack>

                                  {m.note && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                      {m.note}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>

                              <Stack
                                direction="row"
                                gap={1}
                                alignItems="center"
                                flexWrap="wrap"
                                justifyContent="flex-end"
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                              >
                                {m.status === "completed" && (
                                  <>
                                    <Button size="small" variant="outlined" href={m.outputUrl}>
                                      View Output
                                    </Button>
                                    <Button size="small" variant="outlined" href={m.paymentUrl}>
                                      View Payment
                                    </Button>
                                  </>
                                )}

                                {m.status === "active" && (
                                  <Button size="small" variant="contained">
                                    Upload Files
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Activity */}
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                        Activity
                      </Typography>
                      <List dense>
                        {contract.activity.map((a, idx) => (
                          <React.Fragment key={idx}>
                            <ListItem disableGutters>
                              <ListItemText primary={a} />
                            </ListItem>
                            {idx !== contract.activity.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  {/* Messages preview */}
                  <Card>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          Messages (preview)
                        </Typography>
                        <Button size="small" onClick={() => setTab(2)}>
                          Open Messages
                        </Button>
                      </Stack>

                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {contract.messagesPreview.map((m, idx) => (
                          <Stack key={idx} direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 28, height: 28 }}>{String(m.from || "?")[0]}</Avatar>
                            <Typography variant="body2">
                              <b>{m.from}:</b> {m.text}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              )}

              {/* Messages tab */}
              {tab === 2 && (
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      Messages
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        height: { xs: 360, md: 420 },
                        overflow: "auto",
                      }}
                    >
                      <Stack spacing={1.25}>
                        {/* Client bubble */}
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Avatar sx={{ width: 32, height: 32 }}>C</Avatar>
                          <Paper variant="outlined" sx={{ p: 1, maxWidth: "70%" }}>
                            <Typography variant="body2">Here is the initial draft for review.</Typography>
                          </Paper>
                        </Stack>

                        {/* You bubble */}
                        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="flex-end">
                          <Paper variant="outlined" sx={{ p: 1, maxWidth: "70%" }}>
                            <Typography variant="body2">I’ll check this and get back to you soon.</Typography>
                          </Paper>
                          <Avatar sx={{ width: 32, height: 32 }}>Y</Avatar>
                        </Stack>
                      </Stack>
                    </Paper>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                      <IconButton>
                        <AttachFileRoundedIcon />
                      </IconButton>

                      <TextField fullWidth placeholder="Type a message…" size="small" />

                      <Button variant="contained" endIcon={<SendRoundedIcon />}>
                        Send
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Other tabs placeholder */}
              {tab !== 0 && tab !== 2 && (
                <Card>
                  <CardContent>
                    <Typography sx={{ fontWeight: 800 }}>Coming soon</Typography>
                    <Typography variant="body2" color="text.secondary">
                      این تب رو بعداً با API و کامپوننت‌های مربوطه کامل می‌کنیم.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>

          {/* Sidebar */}
          <Box sx={sideWrapSx}>
            <Box sx={{ width: "100%" }}>
              <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      Actions
                    </Typography>

                    <Stack spacing={1}>
                      <Button fullWidth variant="contained">
                        Submit Work
                      </Button>
                      <Button fullWidth variant="outlined">
                        Request Changes
                      </Button>
                      <Button fullWidth variant="outlined" color="error">
                        Open Dispute
                      </Button>

                      <Divider />

                      <Button fullWidth variant="outlined">
                        Extend Deadline
                      </Button>
                      <Button fullWidth variant="outlined" color="error">
                        End Contract
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      People & Roles
                    </Typography>

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28 }}>C</Avatar>
                        <Typography variant="body2">
                          Client (Owner): <b>{contract.clientName}</b>
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28 }}>Y</Avatar>
                        <Typography variant="body2">
                          Freelancer: <b>{contract.freelancerName}</b>
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        Arbitrator: <b>None</b>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      Quick Summary
                    </Typography>

                    <Stack spacing={0.75}>
                      <Typography variant="body2" color="text.secondary">
                        Next milestone: <b>Implement UI</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Escrow: <b>{formatMoney(contract.escrow)}</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: <b>{contract.dueDate}</b>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* (اختیاری) برای حفظ فاصله پایین صفحه */}
        <Box sx={{ height: 8 }} />
      </Container>

      {/* ✅ این Grid/Container رو نگه داشتیم؟ بله، ولی Body رو بهتر کردیم.
          (Grid import هنوز هست چون از کد قبلی حذف نکردیم؛
           اگر دوست داشتی بعداً می‌تونیم خیلی تمیز Grid رو هم حذف کنیم) */}
      <Grid container spacing={2} sx={{ display: "none" }} />
    </Box>
  );
}