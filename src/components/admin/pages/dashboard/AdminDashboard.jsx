import { Box, Grid, Stack, Button, Tabs, Tab, Divider, Paper, Typography, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../layouts/AdminPageHeader";
import SectionCard from "./components/SectionCard";
import StatCard from "./components/StatCard";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import MiniSparkline from "./components/MiniSparkline";

export default function AdminDashboard() {
  const [ticketTab, setTicketTab] = useState(0);

  const stats = useMemo(
    () => [
      { label: "Total Revenue", value: "$25,400", helper: "Last 30 days", icon: <PaidOutlinedIcon /> },
      { label: "Freelancers", value: "1,432", helper: "Verified & active", icon: <GroupOutlinedIcon /> },
      { label: "Clients", value: "678", helper: "Employers", icon: <BusinessCenterOutlinedIcon /> },
      { label: "Active Projects", value: "245", helper: "In progress", icon: <WorkOutlineOutlinedIcon /> },
    ],
    []
  );

  const tickets = useMemo(
    () => ({
      new: [
        { title: "Payment issue", tag: "Financial" },
        { title: "Account access problem", tag: "Account" },
      ],
      progress: [{ title: "Dispute review requested", tag: "Judge" }],
      closed: [{ title: "Refund completed", tag: "Financial" }],
    }),
    []
  );

  const activeTickets = ticketTab === 0 ? tickets.new : ticketTab === 1 ? tickets.progress : tickets.closed;

  return (
    <Box>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Quick overview of operations, tickets, and content."
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Dashboard" }]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">Export</Button>
            <Button variant="contained">Create</Button>
          </Stack>
        }
      />

      {/* ROW 1 */}
      <Grid container spacing={2.5} alignItems="stretch">
        <Grid item xs={12} lg={8} sx={{ display: "flex" }}>
          <SectionCard title="Site Overview" sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {stats.map((s) => (
                <Grid key={s.label} item xs={12} sm={6}>
                  <StatCard icon={s.icon} label={s.label} value={s.value} helper={s.helper} />
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={4} sx={{ display: "flex" }}>
          <SectionCard title="Skills & Projects" subtitle="Quick actions" sx={{ width: "100%" }}>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ConstructionOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3, bgcolor: "surface.soft" }}
              >
                Manage Skills
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FolderOpenOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3, bgcolor: "surface.soft" }}
              >
                Manage Projects
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AdminPanelSettingsOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3 }}
              >
                Access Settings
              </Button>

              {/* filler برای برابر شدن ارتفاع با کارت سمت چپ (اگه لازم شد) */}
              <Box sx={{ flexGrow: 1 }} />
            </Stack>
          </SectionCard>
        </Grid>

        {/* ROW 2 */}
        <Grid item xs={12} lg={7} sx={{ display: "flex" }}>
          <SectionCard
            title="Support Tickets"
            subtitle="Latest tickets"
            action={<Button size="small">View All</Button>}
            sx={{ width: "100%" }}
          >
            <Tabs
              value={ticketTab}
              onChange={(_, v) => setTicketTab(v)}
              sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 700 } }}
            >
              <Tab label="New" />
              <Tab label="In Progress" />
              <Tab label="Closed" />
            </Tabs>

            <Divider sx={{ my: 2, borderColor: "surface.border" }} />

            <Stack spacing={1.25} sx={{ flexGrow: 1 }}>
              {activeTickets.map((t, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: "surface.border",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>{t.title}</Typography>
                  <Chip label={t.tag} size="small" />
                </Paper>
              ))}

              {activeTickets.length === 0 ? (
                <Typography color="text.secondary">No tickets in this tab.</Typography>
              ) : null}

              <Box sx={{ flexGrow: 1 }} />
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={5} sx={{ display: "flex" }}>
          <SectionCard title="Content Management" subtitle="Posts & articles" sx={{ width: "100%" }}>
            <Stack spacing={1.5} sx={{ height: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PostAddOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3, bgcolor: "surface.soft" }}
              >
                Create New Post
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3, bgcolor: "surface.soft" }}
              >
                Edit Posts
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArticleOutlinedIcon />}
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderRadius: 3, bgcolor: "surface.soft" }}
              >
                Manage Articles
              </Button>

              <Box sx={{ flexGrow: 1 }} />
            </Stack>
          </SectionCard>
        </Grid>

        {/* ROW 3 */}
        <Grid item xs={12} lg={7} sx={{ display: "flex" }}>
          <SectionCard title="User Profiles" subtitle="At a glance" sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <StatCard icon={<GroupOutlinedIcon />} label="Freelancers" value="1,432" helper="Tap to view list" />
              </Grid>
              <Grid item xs={12} md={6}>
                <StatCard icon={<BusinessCenterOutlinedIcon />} label="Clients" value="678" helper="Tap to view list" />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={5} sx={{ display: "flex" }}>
          <SectionCard title="Site Reports" subtitle="Revenue & withdrawals" sx={{ width: "100%" }}>
            <Stack spacing={2}>
              <StatCard
                icon={<PaidOutlinedIcon />}
                label="Monthly Revenue"
                value="$5,200"
                helper="Last 30 days"
                right={<MiniSparkline data={[2, 4, 3, 7, 6, 9, 8, 11]} />}
              />
              <StatCard
                icon={<PaidOutlinedIcon />}
                label="Withdrawals"
                value="$1,250"
                helper="Last 30 days"
                right={<MiniSparkline data={[8, 6, 6, 5, 4, 5, 3, 2]} />}
              />
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}