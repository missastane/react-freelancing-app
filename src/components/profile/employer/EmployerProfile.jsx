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
    Tabs,
    Tab,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

// ✅ Added icons for missing employer sections (Upwork-like)
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

// ✅ Added tab helpers (no deletion of your code — only additions)
function a11yProps(index) {
    return {
        id: `employer-profile-tab-${index}`,
        "aria-controls": `employer-profile-tabpanel-${index}`,
    };
}

function TabPanel({ value, index, children }) {
    if (value !== index) return null;
    return <Box sx={{ mt: 2 }}>{children}</Box>;
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

        // ✅ Added: Upwork-like trust flags + hiring history + more stats
        verifiedPayment: true,
        onTimePayer: true,
        topClient: true,

        extraStats: {
            jobsPosted: "14",
            openJobs: "2",
            completedContracts: "9",
            lastActive: "Today",
        },

        hiringHistory: [
            {
                title: "Website Redesign",
                freelancer: "John Doe",
                date: "Feb 2026 — Mar 2026",
                amount: "$1,250",
                rating: 5,
                note: "Smooth process, clear scope, fast feedback.",
            },
            {
                title: "API Bug Fixes",
                freelancer: "North Studio",
                date: "Jan 2026",
                amount: "$450",
                rating: 4.8,
                note: "Quick turnaround, payment released on time.",
            },
            {
                title: "Landing Page Build",
                freelancer: "Bright Media",
                date: "Dec 2025",
                amount: "$300",
                rating: 5,
                note: "Great communication and delivery.",
            },
        ],
    };

    // ✅ Added: tabs for employer (Upwork-like)
    const [tab, setTab] = React.useState(0);

    return (
        <Grid container spacing={2}>
            {/* Main */}
            <Grid item xs={12} md={10} sx={{ minWidth: { xs: 0,md: "78%" } }}>
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

                                            {/* ✅ Added: trust badges */}
                                            {data.verifiedPayment ? (
                                                <Chip size="small" icon={<VerifiedRoundedIcon />} label="Verified Payment" />
                                            ) : null}
                                            {data.onTimePayer ? (
                                                <Chip size="small" icon={<CheckCircleRoundedIcon />} label="On-time Payer" />
                                            ) : null}
                                            {data.topClient ? <Chip size="small" label="Top Client" /> : null}
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

                    {/* ✅ Tabs بیرون از کارت هدر (مثل FreelancerProfile) */}
                    <Card
                        sx={(t) => ({
                            borderRadius: 3,
                            overflow: "hidden",
                            border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
                        })}
                    >
                        <Box
                            sx={(t) => ({
                                px: 1,
                                bgcolor: t.palette.background.paper,
                                borderBottom: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
                            })}
                        >
                            <Tabs
                                value={tab}
                                onChange={(_, v) => setTab(v)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    "& .MuiTab-root": { fontWeight: 900, textTransform: "none", minHeight: 48 },
                                }}
                            >
                                <Tab label="Overview" {...a11yProps(0)} />
                                <Tab label="Hiring History" {...a11yProps(1)} />
                                <Tab label="Reviews" {...a11yProps(2)} />
                                <Tab label="Open Jobs" {...a11yProps(3)} />
                            </Tabs>
                        </Box>

                        {/* ✅ محتوا داخل همین Card نمایش داده میشه (مثل فریلنسر) */}
                        <Box sx={{ p: { xs: 2, sm: 2.25 } }}>
                            {/* ✅ Tab: Overview */}
                            <TabPanel value={tab} index={0}>
                                <Stack spacing={2}>
                                    {/* About */}
                                    <Section title="About">
                                        <Typography color="text.secondary">{data.about}</Typography>
                                    </Section>

                                    {/* ✅ Quick Summary */}
                                    <Section title="Quick Summary">
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip size="small" icon={<AssignmentRoundedIcon />} label={`Jobs posted ${data.extraStats.jobsPosted}`} />
                                            <Chip size="small" icon={<WorkOutlineRoundedIcon />} label={`Open jobs ${data.extraStats.openJobs}`} />
                                            <Chip
                                                size="small"
                                                icon={<FactCheckRoundedIcon />}
                                                label={`Completed contracts ${data.extraStats.completedContracts}`}
                                            />
                                            <Chip size="small" icon={<CalendarMonthRoundedIcon />} label={`Last active ${data.extraStats.lastActive}`} />
                                        </Stack>
                                    </Section>
                                </Stack>
                            </TabPanel>

                            {/* ✅ Tab: Hiring History */}
                            <TabPanel value={tab} index={1}>
                                <Section
                                    title="Hiring History"
                                    action={
                                        <Button size="small" sx={{ fontWeight: 900, textTransform: "none" }}>
                                            View all
                                        </Button>
                                    }
                                >
                                    <List disablePadding>
                                        {data.hiringHistory.map((x, idx) => (
                                            <React.Fragment key={idx}>
                                                <ListItem disableGutters sx={{ py: 1 }}>
                                                    <ListItemText
                                                        primary={
                                                            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
                                                                <Typography sx={{ fontWeight: 900 }}>
                                                                    {x.title} • <span style={{ fontWeight: 800 }}>{x.freelancer}</span>
                                                                </Typography>

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                    flexWrap="wrap"
                                                                    justifyContent="flex-end"
                                                                >
                                                                    <Typography sx={{ fontWeight: 900 }} noWrap>
                                                                        {x.amount}
                                                                    </Typography>

                                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                                        <StarRoundedIcon fontSize="small" />
                                                                        <Typography sx={{ fontWeight: 900 }}>{x.rating}</Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                        }
                                                        secondary={
                                                            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
                                                                <Typography color="text.secondary">{x.note}</Typography>
                                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                                    {x.date}
                                                                </Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                </ListItem>
                                                {idx !== data.hiringHistory.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Section>
                            </TabPanel>

                            {/* ✅ Tab: Reviews */}
                            <TabPanel value={tab} index={2}>
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
                            </TabPanel>

                            {/* ✅ Tab: Open Jobs */}
                            <TabPanel value={tab} index={3}>
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
                            </TabPanel>
                        </Box>
                    </Card>
                </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid xs={12}
                md="auto"
                sx={{
                    width: { xs: "100%", md: "20%" },
                    flexShrink: 0,
                }}>
                <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
                    <StatCard icon={<PaidRoundedIcon />} label="Total spent" value={data.stats.totalSpent} />
                    <StatCard icon={<WorkOutlineRoundedIcon />} label="Active contracts" value={data.stats.activeContracts} />
                    <StatCard icon={<BoltRoundedIcon />} label="Hire rate" value={data.stats.hireRate} />
                    <StatCard icon={<BoltRoundedIcon />} label="Avg hourly paid" value={data.stats.avgHourlyPaid} />
                    <StatCard icon={<BoltRoundedIcon />} label="Avg response time" value={data.stats.responseTime} />

                    {/* ✅ Added: missing employer stats (Upwork-like) */}
                    <StatCard icon={<AssignmentRoundedIcon />} label="Jobs posted" value={data.extraStats.jobsPosted} />
                    <StatCard icon={<WorkOutlineRoundedIcon />} label="Open jobs" value={data.extraStats.openJobs} />
                    <StatCard icon={<FactCheckRoundedIcon />} label="Completed contracts" value={data.extraStats.completedContracts} />
                </Stack>
            </Grid>
        </Grid>
    );
}