import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    Divider,
    IconButton,
    InputAdornment,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Slide,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
    AppBar,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import KpiCard from "../dashboard/shared/KpiCard";
import SectionCard from "../dashboard/shared/SectionCard";

import { useRole } from "../../context/RoleContext";

/* ---------------------------------------------
   Mock data (بعداً راحت به API وصل میشه)
---------------------------------------------- */
const CONTRACTS = [
    {
        id: "c1",
        title: "Build a Landing Page",
        type: "Fixed",
        status: "Active",
        progress: 72,
        dueHint: "2/3 milestones due",
        date: "Feb 8, 2026",
        budget: 1050,
        paid: 400,
        pending: 200,
        freelancer: { name: "JaneDesigns", avatar: "J", subtitle: "Ms." },
        client: { name: "Acme Corp", avatar: "A", subtitle: "Client" },
        activity: [
            { date: "Feb 13", text: "Freelancer requested release", meta: "$650" },
            { date: "Feb 12", text: "Payment released", meta: "$200 for milestone #1" },
            { date: "Feb 12", text: "Work submitted", meta: "for milestone #2" },
        ],
    },
    {
        id: "c2",
        title: "Fix Laravel API Bugs",
        type: "Hourly",
        status: "In Review",
        progress: 35,
        dueHint: "$450 pending release",
        date: "Feb 6, 2026",
        budget: 800,
        paid: 250,
        pending: 450,
        freelancer: { name: "DevMaster", avatar: "D", subtitle: "Mr." },
        client: { name: "North Studio", avatar: "N", subtitle: "Client" },
        activity: [
            { date: "Feb 11", text: "Work delivered", meta: "Awaiting review" },
            { date: "Feb 10", text: "Timesheet submitted", meta: "8h" },
        ],
    },
    {
        id: "c3",
        title: "Design a Logo Set",
        type: "Fixed",
        status: "Awaiting Approval",
        progress: 55,
        dueHint: "Submit #3 milestone",
        date: "Feb 3, 2026",
        budget: 600,
        paid: 200,
        pending: 200,
        freelancer: { name: "PixelPro", avatar: "P", subtitle: "Studio" },
        client: { name: "Bright LLC", avatar: "B", subtitle: "Client" },
        activity: [{ date: "Feb 09", text: "Milestone #3 submitted", meta: "Needs approval" }],
    },
    {
        id: "c4",
        title: "UI Audit",
        type: "Fixed",
        status: "Completed",
        progress: 100,
        dueHint: "All milestones done",
        date: "Jan 28, 2026",
        budget: 500,
        paid: 500,
        pending: 0,
        freelancer: { name: "UxGuru", avatar: "U", subtitle: "Consultant" },
        client: { name: "Studio 11", avatar: "S", subtitle: "Client" },
        activity: [{ date: "Feb 02", text: "Contract completed", meta: "All paid" }],
    },
];

function money(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

function StatusChip({ status }) {
    const map = {
        Active: { label: "Active", variant: "filled", color: "success" },
        "In Review": { label: "In Review", variant: "filled", color: "warning" },
        "Awaiting Approval": { label: "Awaiting Approval", variant: "filled", color: "info" },
        Completed: { label: "Completed", variant: "filled", color: "secondary" },
    };
    const cfg = map[status] || { label: status, variant: "outlined", color: "default" };
    return <Chip size="small" label={cfg.label} variant={cfg.variant} color={cfg.color} />;
}

/* -------------------------------------------------------
   Role-based counterparty + actions
-------------------------------------------------------- */
function getCounterparty(contract, role) {
    return role === "employer" ? contract.freelancer : contract.client;
}
function getCounterpartyLabel(role) {
    return role === "employer" ? "Freelancer" : "Client";
}

function getRowActions(contract, role, openContract) {
    const actions = [];

    actions.push({
        key: "view",
        label: "View",
        variant: "outlined",
        icon: <OpenInNewRoundedIcon fontSize="small" />,
        onClick: () => openContract(contract.id),
    });

    if (role === "employer") {
        if (contract.status === "In Review") {
            actions.push({
                key: "review",
                label: "Review",
                variant: "contained",
                icon: <RateReviewRoundedIcon fontSize="small" />,
                onClick: () => { },
            });
        }
        if (contract.status === "Awaiting Approval") {
            actions.push({
                key: "approve",
                label: "Approve",
                variant: "contained",
                icon: <VerifiedRoundedIcon fontSize="small" />,
                onClick: () => { },
            });
        }
    } else {
        if (contract.status === "Active") {
            actions.push({
                key: "submit",
                label: "Submit",
                variant: "contained",
                icon: <UploadFileRoundedIcon fontSize="small" />,
                onClick: () => { },
            });
        }
        if (contract.status === "Awaiting Approval") {
            actions.push({
                key: "update",
                label: "Update",
                variant: "outlined",
                icon: <FactCheckRoundedIcon fontSize="small" />,
                onClick: () => { },
            });
        }
    }

    // ✅ جدول شلوغ نشه (۲ اکشن کافی)
    return actions.slice(0, 2);
}

/* -------------------------------------------------------
   Mobile full-screen dialog transition
-------------------------------------------------------- */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/* -------------------------------------------------------
   Details content (reused in sidebar + mobile modal)
-------------------------------------------------------- */
function ContractDetails({ contract, role, onOpenProfile, openContract }) {
    const counterpartyLabel = getCounterpartyLabel(role);
    const counterparty = contract ? getCounterparty(contract, role) : null;

    const detailsActions = React.useMemo(() => {
        if (!contract) return [];
        const actions = [];

        actions.push({
            key: "open",
            label: "Open Contract",
            variant: "outlined",
            icon: <OpenInNewRoundedIcon />,
            onClick: () => openContract(contract.id),
        });

        if (role === "employer") {
            if (contract.status === "In Review") {
                actions.push({
                    key: "review",
                    label: "Review Work",
                    variant: "contained",
                    icon: <RateReviewRoundedIcon />,
                    onClick: () => { },
                });
            }
            if (contract.status === "Awaiting Approval") {
                actions.push({
                    key: "approve",
                    label: "Approve",
                    variant: "contained",
                    icon: <VerifiedRoundedIcon />,
                    onClick: () => { },
                });
            }
        } else {
            if (contract.status === "Active") {
                actions.push({
                    key: "submit",
                    label: "Submit Work",
                    variant: "contained",
                    icon: <UploadFileRoundedIcon />,
                    onClick: () => { },
                });
            }
            if (contract.status === "Awaiting Approval") {
                actions.push({
                    key: "update",
                    label: "Update Submission",
                    variant: "outlined",
                    icon: <FactCheckRoundedIcon />,
                    onClick: () => { },
                });
            }
        }

        return actions.slice(0, 2);
    }, [contract, role]);

    if (!contract) {
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 900 }}>Select a contract</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.6 }}>
                    Details will show up here.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{contract.title}</Typography>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Avatar sx={{ width: 34, height: 34 }}>{counterparty?.avatar}</Avatar>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{ fontWeight: 900, cursor: "pointer" }}
                        noWrap
                        onClick={() => onOpenProfile?.(counterparty)}
                    >
                        {counterparty?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {counterpartyLabel}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1 }} />
                <StatusChip status={contract.status} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Date</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{contract.date}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Type</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{contract.type}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Budget</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{money(contract.budget)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Paid so far</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{money(contract.paid)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Pending</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{money(contract.pending)}</Typography>
                </Stack>
            </Stack>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 900, mb: 0.8 }}>
                    Progress
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={contract.progress}
                    sx={(t) => ({
                        height: 10,
                        borderRadius: 999,
                        bgcolor: t.palette.surface?.borderTint || "divider",
                    })}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.7, display: "block" }}>
                    {contract.dueHint}
                </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {detailsActions.map((a) => (
                    <Button
                        key={a.key}
                        fullWidth
                        variant={a.variant}
                        startIcon={a.icon}
                        onClick={a.onClick}
                        sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                    >
                        {a.label}
                    </Button>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
                <HistoryRoundedIcon fontSize="small" />
                <Typography sx={{ fontWeight: 900 }}>Latest Activity</Typography>
                <Box sx={{ flex: 1 }} />
                <Button size="small" sx={{ fontWeight: 900, textTransform: "none" }}>
                    View all
                </Button>
            </Stack>

            <List disablePadding>
                {contract.activity.map((a, idx) => (
                    <ListItem key={idx} disableGutters sx={{ py: 0.9 }}>
                        <ListItemText
                            primary={
                                <Stack direction="row" justifyContent="space-between" gap={2}>
                                    <Typography sx={{ fontWeight: 900 }}>{a.date}</Typography>
                                    {a.meta ? (
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {a.meta}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            }
                            secondary={a.text}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

/* -------------------------------------------------------
   Contracts row (Desktop) - ✅ grid to avoid overflow
-------------------------------------------------------- */
function ContractRowDesktop({ contract, role, selected, onSelect, onOpenProfile, openContract }) {
    const rowActions = getRowActions(contract, role, openContract);
    const counterparty = getCounterparty(contract, role);

    return (
        <Box
            onClick={() => onSelect(contract.id)}
            sx={(t) => ({
                cursor: "pointer",
                borderRadius: 2,
                p: 1.25,
                border: `1px solid ${selected
                    ? t.palette.primary.main || t.palette.divider
                    : t.palette.surface?.border || t.palette.divider
                    }`,
                bgcolor: selected ? t.palette.surface?.strong || t.palette.background.paper : "transparent",
                transition: "120ms ease",
                "&:hover": { bgcolor: t.palette.surface?.soft || "action.hover" },
                overflow: "hidden",
            })}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    flexWrap: "wrap",
                }}
            >
                {/* Contract */}
                <Box sx={{ flex: "1 1 260px", minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 900 }}>
                        {contract.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {contract.type} • {contract.date}
                    </Typography>
                </Box>

                {/* Counterparty */}
                <Box sx={{ flex: "0 0 220px", minWidth: 220, maxWidth: 220 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar sx={{ width: 30, height: 30 }}>{counterparty.avatar}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                noWrap
                                sx={{ fontWeight: 900, cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenProfile?.(counterparty);
                                }}
                            >
                                {counterparty.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {counterparty.subtitle}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Status */}
                <Box sx={{ flex: "0 0 160px", minWidth: 160 }}>
                    <StatusChip status={contract.status} />
                </Box>

                {/* Progress (✅ فقط lg به بالا نمایش بده تا به سایدبار نخوره) */}
                <Box sx={{ flex: "0 0 220px", minWidth: 220, display: { md: "none", lg: "block" } }}>
                    <Stack spacing={0.6}>
                        <LinearProgress
                            variant="determinate"
                            value={contract.progress}
                            sx={(t) => ({
                                height: 8,
                                borderRadius: 999,
                                bgcolor: t.palette.surface?.borderTint || "divider",
                            })}
                        />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {contract.dueHint}
                        </Typography>
                    </Stack>
                </Box>

                {/* Actions */}
                <Box sx={{ flex: "0 0 auto", marginInlineStart: "auto" }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "nowrap" }}>
                        {rowActions.map((a) => (
                            <Button
                                key={a.key}
                                size="small"
                                variant={a.variant}
                                startIcon={a.icon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    a.onClick?.();
                                }}
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 900,
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    px: 1.2,
                                }}
                            >
                                {a.label}
                            </Button>
                        ))}

                        <IconButton
                            onClick={(e) => e.stopPropagation()}
                            aria-label="more"
                            size="small"
                        >
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
/* -------------------------------------------------------
   Contracts card (Mobile)
-------------------------------------------------------- */
function ContractCardMobile({ contract, role, selected, onSelect, onOpenProfile, openContract }) {
    const rowActions = getRowActions(contract, role, openContract);
    const counterparty = getCounterparty(contract, role);

    return (
        <Box
            onClick={() => onSelect(contract.id)}
            sx={(t) => ({
                borderRadius: 3,
                border: `1px solid ${selected ? t.palette.primary.main || t.palette.divider : t.palette.surface?.border || t.palette.divider
                    }`,
                bgcolor: t.palette.background.paper,
                p: 1.5,
                cursor: "pointer",
            })}
        >
            <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }}>{counterparty.avatar}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900 }} noWrap>
                        {contract.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        <Box
                            component="span"
                            sx={{ fontWeight: 900, color: "text.primary", cursor: "pointer" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenProfile?.(counterparty);
                            }}
                        >
                            {counterparty.name}
                        </Box>
                        {" • "}
                        {contract.type}
                    </Typography>
                </Box>
                <StatusChip status={contract.status} />
            </Stack>

            <Box sx={{ mt: 1.2 }}>
                <LinearProgress
                    variant="determinate"
                    value={contract.progress}
                    sx={(t) => ({
                        height: 8,
                        borderRadius: 999,
                        bgcolor: t.palette.surface?.borderTint || "divider",
                    })}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.7 }}>
                    <Typography variant="caption" color="text.secondary">
                        {contract.dueHint}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {contract.date}
                    </Typography>
                </Stack>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                {rowActions.map((a) => (
                    <Button
                        key={a.key}
                        fullWidth
                        size="small"
                        variant={a.variant}
                        startIcon={a.icon}
                        sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            a.onClick?.();
                        }}
                    >
                        {a.label}
                    </Button>
                ))}
            </Stack>
        </Box>
    );
}

export default function ContractsPage() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    // contract navigation
    const navigate = useNavigate();
    const openContract = (contractId) => {
        navigate(`/contracts/${contractId}`);
    };

    // ✅ role from context
    const { activeRole } = useRole();
    const role = activeRole; // "freelancer" | "employer"

    // Filters
    const [q, setQ] = React.useState("");
    const [status, setStatus] = React.useState("Any");
    const [type, setType] = React.useState("Any");
    const [range, setRange] = React.useState("Last 30 days");

    const [selectedId, setSelectedId] = React.useState(CONTRACTS[0]?.id || null);

    // ✅ mobile details modal
    const [detailsOpen, setDetailsOpen] = React.useState(false);

    const filtered = React.useMemo(() => {
        return CONTRACTS.filter((c) => {
            const counterparty = getCounterparty(c, role);
            const okQ =
                !q ||
                c.title.toLowerCase().includes(q.toLowerCase()) ||
                counterparty.name.toLowerCase().includes(q.toLowerCase());

            const okS = status === "Any" ? true : c.status === status;
            const okT = type === "Any" ? true : c.type === type;

            // range mock (UI only)
            return okQ && okS && okT;
        });
    }, [q, status, type, role]);

    React.useEffect(() => {
        if (selectedId && filtered.some((x) => x.id === selectedId)) return;
        setSelectedId(filtered[0]?.id || null);
    }, [filtered, selectedId]);

    const selected = filtered.find((x) => x.id === selectedId) || null;

    const resetFilters = () => {
        setQ("");
        setStatus("Any");
        setType("Any");
        setRange("Last 30 days");
    };

    const onOpenProfile = (person) => {
        // TODO: navigate(`/profile/${person.id}`)
        console.log("Open profile:", person?.name);
    };

    const handleSelect = (id) => {
        setSelectedId(id);
        if (!isMdUp) setDetailsOpen(true); // ✅ موبایل => مودال تمام صفحه
    };

    const counterpartyLabel = getCounterpartyLabel(role);

    /* Layout wrappers */
    const rowSx = {
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "stretch",
        width: "100%",
    };

    const kpiWrapSx = {
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", md: "1 1 0%" },
        minWidth: { xs: "100%", sm: 320, md: 250 },
        display: "flex",
    };

    const leftWrapSx = {
        flex: { xs: "1 1 100%", md: "1.55 1 0%" },
        minWidth: { xs: "100%", md: 620 },
        display: "flex",
        alignItems: "stretch",
    };

    const rightWrapSx = {
        flex: { xs: "1 1 100%", md: "0.9 1 0%" },
        minWidth: { xs: "100%", md: 380 },
        display: "flex",
        alignItems: "stretch",
    };

    // KPI counts
    const kpiActive = CONTRACTS.filter((x) => x.status === "Active").length;
    const kpiReview = CONTRACTS.filter((x) => x.status === "In Review").length;
    const kpiApproval = CONTRACTS.filter((x) => x.status === "Awaiting Approval").length;
    const kpiDone = CONTRACTS.filter((x) => x.status === "Completed").length;

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
                            Contracts
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.6 }}>
                            Manage contracts as a {role === "employer" ? "client" : "freelancer"}.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                        >
                            New Contract
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                        >
                            Export
                        </Button>
                    </Stack>
                </Stack>

                {/* KPI Row */}
                <Box sx={rowSx}>
                    <Box sx={kpiWrapSx}>
                        <KpiCard
                            icon={<WorkOutlineRoundedIcon />}
                            label="Active Contracts"
                            value={String(kpiActive)}
                            hint="Ongoing milestones"
                            href="#"
                        />
                    </Box>

                    <Box sx={kpiWrapSx}>
                        <KpiCard
                            icon={<RateReviewRoundedIcon />}
                            label="In Review"
                            value={String(kpiReview)}
                            hint="Pending review"
                            href="#"
                        />
                    </Box>

                    <Box sx={kpiWrapSx}>
                        <KpiCard
                            icon={<HourglassBottomRoundedIcon />}
                            label="Awaiting Approval"
                            value={String(kpiApproval)}
                            hint="Deliverables pending"
                            href="#"
                        />
                    </Box>

                    <Box sx={kpiWrapSx}>
                        <KpiCard
                            icon={<TaskAltRoundedIcon />}
                            label="Completed"
                            value={String(kpiDone)}
                            hint="See history"
                            href="#"
                        />
                    </Box>
                </Box>

                {/* Filters */}
                <SectionCard
                    title="Filters"
                    action={
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<RestartAltRoundedIcon />}
                            onClick={resetFilters}
                            sx={{ fontWeight: 900, textTransform: "none" }}
                        >
                            Reset
                        </Button>
                    }
                    sx={{ mt: 2, width: "100%" }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.2}
                        alignItems={{ xs: "stretch", md: "center" }}
                    >
                        <TextField
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={`Search contract / ${counterpartyLabel.toLowerCase()}...`}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
                            }}
                        />

                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            size="small"
                            sx={{ minWidth: { xs: "100%", md: 170 }, borderRadius: 2.5 }}
                        >
                            {["Any", "Active", "In Review", "Awaiting Approval", "Completed"].map((x) => (
                                <MenuItem key={x} value={x}>
                                    {x}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            size="small"
                            sx={{ minWidth: { xs: "100%", md: 140 }, borderRadius: 2.5 }}
                        >
                            {["Any", "Fixed", "Hourly"].map((x) => (
                                <MenuItem key={x} value={x}>
                                    {x}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            size="small"
                            sx={{ minWidth: { xs: "100%", md: 170 }, borderRadius: 2.5 }}
                        >
                            {["Last 7 days", "Last 30 days", "Last 90 days", "This year"].map((x) => (
                                <MenuItem key={x} value={x}>
                                    {x}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </SectionCard>

                {/* Main row: list + (desktop) sidebar */}
                <Box sx={{ ...rowSx, mt: 2 }}>
                    {/* Left: contracts list */}
                    <Box sx={leftWrapSx}>
                        <SectionCard
                            title={`Contracts (${filtered.length})`}
                            action={
                                <IconButton aria-label="more">
                                    <MoreHorizRoundedIcon />
                                </IconButton>
                            }
                            sx={{ width: "100%", height: "100%" }}
                        >
                            {filtered.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: "center" }}>
                                    <Typography sx={{ fontWeight: 900 }}>No contracts found</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 0.6 }}>
                                        Try changing your filters.
                                    </Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {isMdUp ? (
                                        <>
                                            {/* Desktop header row */}
                                            <Box
                                                sx={(t) => ({
                                                    px: 1.2,
                                                    pb: 0.6,
                                                    color: "text.secondary",
                                                    fontSize: 12,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.2,
                                                    flexWrap: "wrap",
                                                    "& > div": { fontWeight: 800 },
                                                })}
                                            >
                                                <Box sx={{ flex: "1 1 260px", minWidth: 0 }}>Contract</Box>
                                                <Box sx={{ flex: "0 0 220px", minWidth: 220 }}>{counterpartyLabel}</Box>
                                                <Box sx={{ flex: "0 0 160px", minWidth: 160 }}>Status</Box>
                                                <Box sx={{ flex: "0 0 220px", minWidth: 220, display: { md: "none", lg: "block" } }}>
                                                    Progress
                                                </Box>
                                                <Box sx={{ flex: "0 0 auto", marginInlineStart: "auto" }}>Actions</Box>
                                            </Box>

                                            <Divider />

                                            <Stack spacing={1} sx={{ mt: 1 }}>
                                                {filtered.map((c) => (
                                                    <ContractRowDesktop
                                                        key={c.id}
                                                        contract={c}
                                                        role={role}
                                                        selected={c.id === selectedId}
                                                        onSelect={handleSelect}
                                                        onOpenProfile={onOpenProfile}
                                                        openContract={openContract}
                                                    />
                                                ))}
                                            </Stack>
                                        </>
                                    ) : (
                                        <Stack spacing={1.2}>
                                            {filtered.map((c) => (
                                                <ContractCardMobile
                                                    key={c.id}
                                                    contract={c}
                                                    role={role}
                                                    selected={c.id === selectedId}
                                                    onSelect={handleSelect}
                                                    onOpenProfile={onOpenProfile}
                                                    openContract={openContract}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Stack>
                            )}
                        </SectionCard>
                    </Box>

                    {/* ✅ Right: details sidebar فقط دسکتاپ */}
                    {isMdUp ? (
                        <Box sx={rightWrapSx}>
                            <SectionCard
                                title="Contract Details"
                                action={
                                    <IconButton aria-label="more">
                                        <MoreHorizRoundedIcon />
                                    </IconButton>
                                }
                                sx={{ width: "100%", height: "100%" }}
                            >
                                <ContractDetails contract={selected} role={role} onOpenProfile={onOpenProfile} openContract={openContract} />
                            </SectionCard>
                        </Box>
                    ) : null}
                </Box>
            </Container>

            {/* ✅ Mobile: full-screen modal */}
            {/* ✅ Mobile: full-screen modal (Scrollable) */}
            <Dialog
                fullScreen
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                TransitionComponent={Transition}
                scroll="paper"
                PaperProps={{
                    sx: {
                        overflow: "hidden", // مهم: اسکرول رو می‌دیم به کانتینر داخلی
                    },
                }}
            >
                <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
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
                            <IconButton edge="start" onClick={() => setDetailsOpen(false)} aria-label="close">
                                <CloseRoundedIcon />
                            </IconButton>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography sx={{ fontWeight: 900 }} noWrap>
                                    Contract Details
                                </Typography>
                                {selected ? (
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {selected.title}
                                    </Typography>
                                ) : null}
                            </Box>

                            <IconButton aria-label="more">
                                <MoreHorizRoundedIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    {/* ✅ Scrollable content area */}
                    <Box
                        sx={(t) => ({
                            flex: 1,
                            overflowY: "auto",
                            WebkitOverflowScrolling: "touch",
                            p: 2,
                            bgcolor: t.palette.surface?.soft || t.palette.background.default,
                        })}
                    >
                        <SectionCard title="Details" sx={{ width: "100%" }}>
                            <ContractDetails contract={selected} role={role} onOpenProfile={onOpenProfile} openContract={openContract} />
                        </SectionCard>

                        {/* یه فاصله آخر برای اینکه ته محتوا زیر safe-area گیر نکنه */}
                        <Box sx={{ height: 16 }} />
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
}