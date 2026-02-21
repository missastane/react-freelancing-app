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
    Switch,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    useMediaQuery,
    useTheme,
    Container,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

function StatPill({ icon, label, value }) {
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

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        "aria-controls": `profile-tabpanel-${index}`,
    };
}

function TabPanel({ value, index, children }) {
    if (value !== index) return null;
    return <Box sx={{ mt: 2 }}>{children}</Box>;
}

function SidebarContent({ data, openToOffers, setOpenToOffers, visibility, setVisibility }) {
    return (
        <Stack spacing={2}>
            {/* Stats */}
            <StatPill icon={<StarRoundedIcon />} label="Rating" value={`${data.rating} / 5`} />
            <StatPill icon={<BoltRoundedIcon />} label="Job Success" value={`${data.jobSuccess}%`} />
            <StatPill icon={<BoltRoundedIcon />} label="Response time" value={data.responseTime} />
            <StatPill icon={<BoltRoundedIcon />} label="Response rate" value={data.responseRate} />

            {/* Availability */}
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>Availability</Typography>

                    <Typography sx={{ fontWeight: 900 }}>
                        {data.availability === "Available" ? "Available Now" : "Not Available"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Send me questions or job invites and I&apos;ll respond within {data.responseTime}.
                    </Typography>

                    <FormControlLabel
                        sx={{ mt: 1.25 }}
                        control={<Switch checked={openToOffers} onChange={(e) => setOpenToOffers(e.target.checked)} />}
                        label={<Typography sx={{ fontWeight: 800 }}>Open to Offers</Typography>}
                    />

                    <Divider sx={{ my: 1.5 }} />

                    <FormControl>
                        <FormLabel sx={{ fontWeight: 900, mb: 0.5 }}>Profile Visibility</FormLabel>
                        <RadioGroup value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                            <FormControlLabel value="public" control={<Radio />} label="Public" />
                            <FormControlLabel value="employers" control={<Radio />} label="Only Employers" />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Languages */}
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>Languages</Typography>
                    <Stack spacing={1}>
                        {data.languages.map((l) => (
                            <Stack key={l} direction="row" spacing={1} alignItems="center">
                                <LanguageRoundedIcon fontSize="small" />
                                <Typography sx={{ fontWeight: 800 }}>{l}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default function FreelancerProfile() {
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

    // TODO: بعداً از API میاد
    const data = {
        name: "John Doe",
        title: "Laravel + React Developer",
        location: "Iran",
        hourlyRate: 18,
        availability: "Available",
        verified: true,
        topRated: true,

        rating: 4.9,
        jobSuccess: 92,
        responseTime: "2h",
        responseRate: "95%",

        skills: ["Laravel", "REST API", "MySQL", "React", "MUI", "Git", "Docker"],

        overview:
            "I build clean, scalable APIs with Laravel and modern frontends with React + MUI. I focus on performance, maintainability, and solid UX.",

        languages: ["English", "Persian"],

        education: [
            { school: "University of X", degree: "B.Sc. Computer Science", years: "2019 — 2023" },
            { school: "Online", degree: "Advanced Backend Engineering", years: "2024" },
        ],

        experience: [
            {
                company: "IPTV Company",
                role: "Backend Developer",
                years: "2025 — 2026",
                note: "Built v1.0.0, payment + admin modules",
            },
            {
                company: "Freelance",
                role: "Full-Stack Developer",
                years: "2023 — Present",
                note: "Marketplace + Chat systems",
            },
        ],

        portfolio: [
            { title: "Freelance Platform", tech: ["Laravel", "React", "MUI"], hint: "Contracts + Chat + Admin", cover: "FP" },
            { title: "E-Commerce", tech: ["Laravel", "Bootstrap"], hint: "OTP Auth + Orders", cover: "EC" },
            { title: "Chat API", tech: ["Laravel", "JWT"], hint: "Realtime ready", cover: "CH" },
        ],

        completed: [
            {
                title: "Landing Page Build",
                rating: 5,
                note: "Great communication",
                amount: "$1,250",
                client: "Acme Inc.",
                date: "Feb 2026 — Mar 2026",
            },
            { title: "API Bug Fixes", rating: 4.8, note: "Fast delivery", amount: "$450", client: "North Studio", date: "Jan 2026" },
        ],

        reviews: [
            { from: "Acme Inc.", rating: 5, text: "Very professional and on-time delivery." },
            { from: "Bright Media", rating: 4.8, text: "Great communication, would hire again." },
        ],
    };

    // Tabs
    const [tab, setTab] = React.useState(0);

    // Availability / visibility (UI only for now)
    const [openToOffers, setOpenToOffers] = React.useState(true);
    const [visibility, setVisibility] = React.useState("public"); // public | employers | private

    // Mobile/Tablet sidebar drawer (full screen)
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Layout helpers (مثل صفحات دیگه‌ات که وسط متمرکز می‌شن)
    const rowSx = {
        display: "flex",
        flexWrap: { xs: "wrap", lg: "nowrap" },
        gap: 2,
        alignItems: "flex-start",
        width: "100%",
    };

    const mainWrapSx = {
        flex: { xs: "1 1 100%", lg: "1 1 0%" },
        minWidth: 0,
    };

   const sideWrapSx = {
  flex: { xs: "1 1 100%", lg: "0 0 250px" },
  minWidth: { xs: "100%", lg: 250 },
  display: { xs: "none", lg: "block" },
};

    return (
        <Box
            sx={{
                py: { xs: 3, sm: 4 },
                bgcolor: theme.palette.surface?.soft || theme.palette.background.default,
                minHeight: "100vh",
                mx:{lg : -3}
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                
                <Box sx={rowSx}>
                    
                    {/* MAIN */}
                    <Box sx={mainWrapSx}>
                        
                        <Stack spacing={2}>
                            {/* Header */}
                           
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                                            <Avatar sx={{ width: 64, height: 64 }}>J</Avatar>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                    <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
                                                        {data.name}
                                                    </Typography>

                                                    <Chip size="small" color="success" label={data.availability} />
                                                    {data.verified ? <Chip size="small" icon={<VerifiedRoundedIcon />} label="Verified" /> : null}
                                                    {data.topRated ? <Chip size="small" label="Top Rated" /> : null}
                                                </Stack>

                                                <Typography sx={{ fontWeight: 800 }} noWrap>
                                                    {data.title}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {data.location} • ${data.hourlyRate}/hr
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                                            {/* ✅ در md/xs: دکمه باز کردن سایدبار */}


                                            <Button
                                                variant="contained"
                                                startIcon={<EditRoundedIcon />}
                                                sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                                            >
                                                Edit Profile
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                startIcon={<MailOutlineRoundedIcon />}
                                                sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                                            >
                                                Contact
                                            </Button>
                                        </Stack>
 {!isLgUp ? (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<TuneRoundedIcon />}
                                    onClick={() => setSidebarOpen(true)}
                                    sx={{
                                        borderRadius: 2.5,
                                        fontWeight: 900,
                                        textTransform: "none",
                                        display: { xs: "flex", sm: "none" }, // فقط موبایل
                                    }}
                                >
                                    Stats
                                </Button>
                            ) : null}
                                    </Stack>

                                    <Divider sx={{ my: 2 }} />

                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {data.skills.map((s) => (
                                            <Chip key={s} label={s} size="small" />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* ✅ Tabs بیرون هدر و چسبیده به لبه */}
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
                                        <Tab label="Completed Contracts" {...a11yProps(1)} />
                                        <Tab label="Reviews" {...a11yProps(2)} />
                                        <Tab label="Skills" {...a11yProps(3)} />
                                        <Tab label="Portfolio" {...a11yProps(4)} />
                                        <Tab label="Experience" {...a11yProps(5)} />
                                        <Tab label="Education" {...a11yProps(6)} />
                                    </Tabs>
                                </Box>

                                <Box sx={{ p: { xs: 2, sm: 2.25 } }}>
                                    {/* Tab: Overview */}
                                    <TabPanel value={tab} index={0}>
                                        <Stack spacing={2}>
                                            <Section
                                                title="About Me"
                                                action={
                                                    <Button size="small" sx={{ fontWeight: 900, textTransform: "none" }}>
                                                        Edit
                                                    </Button>
                                                }
                                            >
                                                <Typography color="text.secondary">{data.overview}</Typography>
                                            </Section>

                                            <Section title="Quick Highlights">
                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                    <Chip size="small" icon={<StarRoundedIcon />} label={`Rating ${data.rating}/5`} />
                                                    <Chip size="small" icon={<BoltRoundedIcon />} label={`Job Success ${data.jobSuccess}%`} />
                                                    <Chip size="small" icon={<BoltRoundedIcon />} label={`Response time ${data.responseTime}`} />
                                                    <Chip size="small" icon={<BoltRoundedIcon />} label={`Response rate ${data.responseRate}`} />
                                                </Stack>
                                            </Section>
                                        </Stack>
                                    </TabPanel>

                                    {/* Tab: Completed Contracts */}
                                    <TabPanel value={tab} index={1}>
                                        <Section title="Completed Contracts">
                                            <List disablePadding>
                                                {data.completed.map((x, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <ListItem disableGutters sx={{ py: 1 }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                                        <Typography sx={{ fontWeight: 900 }}>
                                                                            {x.title} • {x.client}
                                                                        </Typography>
                                                                        <Typography sx={{ fontWeight: 900 }} noWrap>
                                                                            {x.amount}
                                                                        </Typography>
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
                                                        {idx !== data.completed.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Section>
                                    </TabPanel>

                                    {/* Tab: Reviews */}
                                    <TabPanel value={tab} index={2}>
                                        <Section title="Reviews">
                                            <List disablePadding>
                                                {data.reviews.map((r, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <ListItem disableGutters sx={{ py: 1 }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                                        <Typography sx={{ fontWeight: 900 }}>{r.from}</Typography>
                                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                                            <StarRoundedIcon fontSize="small" />
                                                                            <Typography sx={{ fontWeight: 900 }}>{r.rating}</Typography>
                                                                        </Stack>
                                                                    </Stack>
                                                                }
                                                                secondary={r.text}
                                                            />
                                                        </ListItem>
                                                        {idx !== data.reviews.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Section>
                                    </TabPanel>

                                    {/* Tab: Skills */}
                                    <TabPanel value={tab} index={3}>
                                        <Section
                                            title="Skills"
                                            action={
                                                <Button size="small" sx={{ fontWeight: 900, textTransform: "none" }}>
                                                    Edit
                                                </Button>
                                            }
                                        >
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {data.skills.map((s) => (
                                                    <Chip key={s} label={s} size="small" />
                                                ))}
                                            </Stack>
                                        </Section>
                                    </TabPanel>

                                    {/* Tab: Portfolio */}
                                    <TabPanel value={tab} index={4}>
                                        <Section
                                            title="Portfolio"
                                            action={
                                                <Button
                                                    size="small"
                                                    startIcon={<CollectionsRoundedIcon />}
                                                    sx={{ fontWeight: 900, textTransform: "none" }}
                                                >
                                                    Add
                                                </Button>
                                            }
                                        >
                                            <Grid container spacing={1.5}>
                                                {data.portfolio.map((p) => (
                                                    <Grid key={p.title} item xs={12} sm={6}>
                                                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                                                            <CardContent>
                                                                <Stack direction="row" spacing={1.2} alignItems="center">
                                                                    <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2 }}>
                                                                        {p.cover}
                                                                    </Avatar>
                                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                        <Typography sx={{ fontWeight: 900 }} noWrap>
                                                                            {p.title}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary" noWrap>
                                                                            {p.hint}
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>

                                                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.2 }}>
                                                                    {p.tech.map((t) => (
                                                                        <Chip key={t} label={t} size="small" />
                                                                    ))}
                                                                </Stack>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Section>
                                    </TabPanel>

                                    {/* Tab: Experience */}
                                    <TabPanel value={tab} index={5}>
                                        <Section
                                            title="Work Experience"
                                            action={
                                                <Button
                                                    size="small"
                                                    startIcon={<WorkOutlineRoundedIcon />}
                                                    sx={{ fontWeight: 900, textTransform: "none" }}
                                                >
                                                    Add
                                                </Button>
                                            }
                                        >
                                            <List disablePadding>
                                                {data.experience.map((x, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <ListItem disableGutters sx={{ py: 1 }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                                        <Typography sx={{ fontWeight: 900 }}>
                                                                            {x.role} • {x.company}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary" noWrap>
                                                                            {x.years}
                                                                        </Typography>
                                                                    </Stack>
                                                                }
                                                                secondary={x.note}
                                                            />
                                                        </ListItem>
                                                        {idx !== data.experience.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Section>
                                    </TabPanel>

                                    {/* Tab: Education */}
                                    <TabPanel value={tab} index={6}>
                                        <Section
                                            title="Education"
                                            action={
                                                <Button
                                                    size="small"
                                                    startIcon={<SchoolRoundedIcon />}
                                                    sx={{ fontWeight: 900, textTransform: "none" }}
                                                >
                                                    Add
                                                </Button>
                                            }
                                        >
                                            <List disablePadding>
                                                {data.education.map((x, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <ListItem disableGutters sx={{ py: 1 }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                                        <Typography sx={{ fontWeight: 900 }}>{x.degree}</Typography>
                                                                        <Typography variant="caption" color="text.secondary" noWrap>
                                                                            {x.years}
                                                                        </Typography>
                                                                    </Stack>
                                                                }
                                                                secondary={x.school}
                                                            />
                                                        </ListItem>
                                                        {idx !== data.education.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Section>
                                    </TabPanel>
                                </Box>
                            </Card>
                        </Stack>
                    </Box>

                    {/* SIDEBAR (فقط دسکتاپ) */}
                    <Box sx={sideWrapSx}>
                        <Box sx={{ position: "sticky", top: 16 }}>
                            <SidebarContent
                                data={data}
                                openToOffers={openToOffers}
                                setOpenToOffers={setOpenToOffers}
                                visibility={visibility}
                                setVisibility={setVisibility}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* ✅ Mobile/Tablet: Full screen sidebar dialog */}
            <Dialog fullScreen open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={(t) => ({
                        bgcolor: t.palette.background.paper,
                        color: t.palette.text.primary,
                        borderBottom: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
                    })}
                >
                    <Toolbar sx={{ gap: 1 }}>
                        <IconButton edge="start" onClick={() => setSidebarOpen(false)} aria-label="close">
                            <CloseRoundedIcon />
                        </IconButton>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontWeight: 900 }} noWrap>
                                Stats & Settings
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {data.name} • {data.title}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box
                    sx={(t) => ({
                        p: 2,
                        bgcolor: t.palette.surface?.soft || t.palette.background.default,
                        minHeight: "100%",
                    })}
                >
                    <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 1 } }}>
                        <SidebarContent
                            data={data}
                            openToOffers={openToOffers}
                            setOpenToOffers={setOpenToOffers}
                            visibility={visibility}
                            setVisibility={setVisibility}
                        />
                        <Box sx={{ height: 16 }} />
                    </Container>
                </Box>
            </Dialog>
        </Box>
    );
}