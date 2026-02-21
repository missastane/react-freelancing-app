import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

function StatCard({ icon, label, value }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ py: 1.6 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ opacity: 0.9 }}>{icon}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Section({ title, action, children }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
          <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
          {action || null}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

export default function EmployerProfile() {
  // TODO: بعداً از API میاد
  const data = {
    name: "Acme Inc.",
    title: "Product & Services",
    location: "USA",
    memberSince: "2024",
    about:
      "We hire long-term freelancers for product design, frontend, and backend work. Clear requirements, on-time payments.",
    stats: {
      totalSpent: "$12,480",
      hireRate: "78%",
      avgHourlyPaid: "$19/hr",
      responseTime: "3h",
      activeContracts: "3",
    },
    reviews: [
      { title: "Great client", rating: 5, note: "Fast feedback and smooth communication." },
      { title: "Paid on time", rating: 4.9, note: "Clear scope, professional." },
    ],
    openJobs: [
      { title: "React UI improvements", note: "Short-term, UI polishing" },
      { title: "Laravel API optimization", note: "Performance + caching" },
    ],
  };

  return (
    <Grid container spacing={2}>
      {/* Main */}
      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          {/* Header */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                  <Avatar sx={{ width: 64, height: 64 }}>A</Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
                        {data.name}
                      </Typography>
                      <Chip size="small" label="Client" />
                    </Stack>

                    <Typography sx={{ fontWeight: 800 }} noWrap>
                      {data.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      {data.location} • Member since {data.memberSince}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    startIcon={<EditRoundedIcon />}
                    sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}>
                    Share
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* About */}
          <Section title="About">
            <Typography color="text.secondary">{data.about}</Typography>
          </Section>

          {/* Reviews */}
          <Section title="Freelancer Reviews">
            <List disablePadding>
              {data.reviews.map((x, idx) => (
                <React.Fragment key={idx}>
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" gap={2}>
                          <Typography sx={{ fontWeight: 900 }}>{x.title}</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <StarRoundedIcon fontSize="small" />
                            <Typography sx={{ fontWeight: 900 }}>{x.rating}</Typography>
                          </Stack>
                        </Stack>
                      }
                      secondary={x.note}
                    />
                  </ListItem>
                  {idx !== data.reviews.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Section>

          {/* Open jobs */}
          <Section
            title="Open Jobs"
            action={
              <Button size="small" sx={{ fontWeight: 900, textTransform: "none" }}>
                View all
              </Button>
            }
          >
            <List disablePadding>
              {data.openJobs.map((x, idx) => (
                <React.Fragment key={idx}>
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 900 }}>{x.title}</Typography>}
                      secondary={x.note}
                    />
                  </ListItem>
                  {idx !== data.openJobs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Section>
        </Stack>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
          <StatCard icon={<PaidRoundedIcon />} label="Total spent" value={data.stats.totalSpent} />
          <StatCard icon={<WorkOutlineRoundedIcon />} label="Active contracts" value={data.stats.activeContracts} />
          <StatCard icon={<BoltRoundedIcon />} label="Hire rate" value={data.stats.hireRate} />
          <StatCard icon={<BoltRoundedIcon />} label="Avg hourly paid" value={data.stats.avgHourlyPaid} />
          <StatCard icon={<BoltRoundedIcon />} label="Avg response time" value={data.stats.responseTime} />
        </Stack>
      </Grid>
    </Grid>
  );
}