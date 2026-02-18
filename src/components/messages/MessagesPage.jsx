import React, { useMemo, useState, useRef } from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    InputBase,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRole } from "../../context/RoleContext";
import { useNavigate } from "react-router-dom";
import ProposalMessageCard from "./ProposalMessageCard";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Chip from "@mui/material/Chip";

function timeLabel(ts) {
    // mock-friendly
    return ts;
}

function EmptyState({ text }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: 6, px: 2, textAlign: "center" }}
            spacing={1}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                💬
            </Box>
            <Typography sx={{ fontWeight: 900 }}>{text}</Typography>
            <Typography variant="body2" color="text.secondary">
                Pick someone from the left panel to view the conversation.
            </Typography>
        </Stack>
    );
}

function ChatBubble({ mine, text, ts }) {
    const theme = useTheme();

    return (
        <Stack direction="row" justifyContent={mine ? "flex-end" : "flex-start"} sx={{ width: "100%" }}>
            <Box
                sx={{
                    maxWidth: 640,
                    px: 1.5,
                    py: 1.1,
                    borderRadius: 3,
                    borderTopRightRadius: mine ? 1.2 : 12,
                    borderTopLeftRadius: mine ? 12 : 1.2,
                    bgcolor: mine ? theme.palette.surface.strong : theme.palette.surface.borderTint,
                    color: mine ? "primary.contrastText" : "text.primary",
                    border: mine ? "none" : "1px solid",
                    borderColor: mine ? "transparent" : "divider",
                }}
            >
                <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{text}</Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 0.75,
                        opacity: mine ? 0.85 : 0.65,
                        textAlign: "right",
                    }}
                >
                    {timeLabel(ts)}
                </Typography>
            </Box>
        </Stack>
    );
}

export default function MessagesPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { activeRole } = useRole(); // "freelancer" | "employer"

    const [attachments, setAttachments] = useState([]);
    const attachRef = useRef(null);

    const navigate = useNavigate();

    const goProject = (p) => {
        const slug = (p.projectSlug || String(p.projectTitle || "project"))
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        navigate(`/projects/${p.projectId}/${slug}`);
    };

    const viewProposal = (p) => {
        console.log("open proposal details", p);
    };

    const pickAttachments = () => attachRef.current?.click();

    const addAttachments = (fileList) => {
        if (!fileList?.length) return;

        const incoming = Array.from(fileList);

        const existingKey = new Set(attachments.map((f) => `${f.name}__${f.size}`));
        const unique = incoming.filter((f) => !existingKey.has(`${f.name}__${f.size}`));

        setAttachments((prev) => [...prev, ...unique]);
    };

    const removeAttachment = (idx) => {
        setAttachments((prev) => prev.filter((_, i) => i !== idx));
    };

    // ✅ mock threads
    const threads = useMemo(
        () => [
            {
                id: "t1",
                person: {
                    name: activeRole === "employer" ? "JaneDesigns" : "Michel",
                    avatar: "https://i.pravatar.cc/120?img=47",
                    online: true,
                    rating: 4.9,
                },
                unread: 2,
                lastMessage: "Great! I've approved your proposal...",
                lastTime: "A moment ago",
                employerStarted: true,
                messages: [
                    {
                        id: "m1",
                        from: "freelancer",
                        ts: "4h ago",
                        type: "proposal",
                        proposal: {
                            projectId: 11,
                            projectTitle: "Develop a Custom CRM System",
                            projectSlug: "develop-a-custom-crm-system",
                            amount: 2000,
                            durationDays: 14,
                            statusLabel: "Pending",
                            note: "Milestones included. Ready to start immediately.",
                        },
                    },
                    {
                        id: "m2",
                        from: activeRole === "employer" ? "employer" : "freelancer",
                        ts: "3h ago",
                        text:
                            "Hi! Yes, I’m available. I’m glad to hear you’re interested.\nWhat time works for you?",
                    },
                    { id: "m3", from: "employer", ts: "2h ago", text: "How about tomorrow at 10 AM? Quick call?" },
                    { id: "m4", from: "freelancer", ts: "2h ago", text: "Perfect. I’ll be there." },
                ],
            },
            {
                id: "t2",
                person: {
                    name: activeRole === "employer" ? "DevMaster" : "PixelPro",
                    avatar: "https://i.pravatar.cc/120?img=12",
                    online: false,
                    rating: 4.6,
                },
                unread: 0,
                lastMessage: "I will handle the CRM system d...",
                lastTime: "1 hour ago",
                employerStarted: false,
                 messages: [
                    {
                        id: "m1",
                        from: "freelancer",
                        ts: "4h ago",
                        type: "proposal",
                        proposal: {
                            projectId: 11,
                            projectTitle: "Develop a Custom CRM System",
                            projectSlug: "develop-a-custom-crm-system",
                            amount: 2000,
                            durationDays: 14,
                            statusLabel: "Pending",
                            note: "Milestones included. Ready to start immediately.",
                        },
                    },
                    {
                        id: "m2",
                        from: activeRole === "employer" ? "employer" : "freelancer",
                        ts: "3h ago",
                        text:
                            "Hi! Yes, I’m available. I’m glad to hear you’re interested.\nWhat time works for you?",
                    },
                    { id: "m3", from: "employer", ts: "2h ago", text: "How about tomorrow at 10 AM? Quick call?" },
                    { id: "m4", from: "freelancer", ts: "2h ago", text: "Perfect. I’ll be there." },
                ],
            },
            {
                id: "t3",
                person: {
                    name: activeRole === "employer" ? "PixelPro" : "SarahFrontend",
                    avatar: "https://i.pravatar.cc/120?img=33",
                    online: false,
                    rating: 4.7,
                },
                unread: 1,
                lastMessage: "Can we discuss regarding th...",
                lastTime: "Yesterday",
                employerStarted: true,
                messages: [
                    { id: "m1", from: "employer", ts: "Yesterday", text: "Hey! I saw your proposal. Can we discuss scope?" },
                ],
            },
        ],
        [activeRole]
    );

    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [draft, setDraft] = useState("");

    const selectedThread = threads.find((t) => t.id === selectedId) || null;

    const filteredThreads = useMemo(() => {
        const q = query.trim().toLowerCase();
        return threads.filter((t) => {
            if (unreadOnly && !t.unread) return false;
            if (!q) return true;
            return t.person.name.toLowerCase().includes(q) || (t.lastMessage || "").toLowerCase().includes(q);
        });
    }, [threads, query, unreadOnly]);

    const totalUnread = useMemo(() => threads.reduce((sum, t) => sum + (t.unread || 0), 0), [threads]);

    // ✅ اجازه ارسال
    const canSend = !!selectedThread && (activeRole === "employer" || selectedThread.employerStarted);

    const handleSend = () => {
        if (!selectedThread) return;
        if (!canSend) return;
        if (!draft.trim() && attachments.length === 0) return;

        console.log("SEND:", {
            threadId: selectedThread.id,
            text: draft.trim(),
            attachments, // File[]
        });

        setDraft("");
        setAttachments([]);
    };

    return (
        <Box sx={{ py: { xs: 2, md: 3 } }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "360px 1fr" },
                    gap: 2,
                    alignItems: "stretch",
                    height: { md: "calc(100vh - 120px)" },
                }}
            >
                {/* LEFT: threads */}
                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: theme.palette.surface.strong,
                        backgroundImage: "none",
                        borderColor: theme.palette.surface.borderTint,
                    }}
                >
                    {/* header */}
                    <Box sx={{ p: 2, bgcolor: "transparent" }}>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                            <Typography sx={{ fontWeight: 900, flex: 1 }}>Messages</Typography>

                            <Tooltip title={unreadOnly ? "Show all" : "Show unread only"}>
                                <IconButton
                                    onClick={() => setUnreadOnly((v) => !v)}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: theme.palette.surface.border,
                                        borderRadius: 2,
                                        bgcolor: theme.palette.surface.soft,
                                    }}
                                >
                                    <Badge badgeContent={totalUnread} color="primary">
                                        <MarkEmailUnreadRoundedIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        {/* search */}
                        <Box
                            sx={{
                                mt: 1.5,
                                px: 1.25,
                                py: 0.9,
                                borderRadius: 999,
                                border: "1px solid",
                                borderColor: theme.palette.surface.border,
                                bgcolor: theme.palette.surface.soft,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <SearchRoundedIcon fontSize="small" />
                            <InputBase
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search contacts..."
                                sx={{ flex: 1, fontSize: 14 }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: theme.palette.surface.borderTint }} />

                    {/* list */}
                    <Box
                        sx={{
                            maxHeight: { xs: 520, md: "calc(100vh - 290px)" },
                            overflowY: "auto",
                            bgcolor: "transparent",
                        }}
                    >
                        {filteredThreads.length === 0 ? (
                            <EmptyState text="No conversations found" />
                        ) : (
                            <Stack sx={{ p: 1.25 }} spacing={1}>
                                {filteredThreads.map((t) => {
                                    const selected = t.id === selectedId;
                                    return (
                                        <Paper
                                            key={t.id}
                                            variant="outlined"
                                            onClick={() => setSelectedId(t.id)}
                                            sx={{
                                                p: 1.25,
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                borderColor: selected ? theme.palette.surface.borderTint : theme.palette.surface.border,
                                                bgcolor: selected ? theme.palette.surface.borderTint : "transparent",
                                                transition: "border-color 120ms ease, background-color 120ms ease",
                                                "&:hover": {
                                                    borderColor: theme.palette.surface.borderTint,
                                                    bgcolor: selected ? theme.palette.surface.strong : theme.palette.surface.soft,
                                                },
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.25} alignItems="center">
                                                <Box sx={{ position: "relative" }}>
                                                    <Avatar src={t.person.avatar} alt={t.person.name} />
                                                    {t.person.online && (
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                right: 1,
                                                                bottom: 1,
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: 999,
                                                                bgcolor: "success.main",
                                                                border: "2px solid",
                                                                borderColor: theme.palette.background.paper,
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography sx={{ fontWeight: 900 }} noWrap>
                                                            {t.person.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {t.lastTime}
                                                        </Typography>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {t.lastMessage}
                                                    </Typography>
                                                </Box>

                                                {t.unread ? (
                                                    <Box
                                                        sx={{
                                                            minWidth: 26,
                                                            height: 22,
                                                            px: 1,
                                                            borderRadius: 999,
                                                            bgcolor: "primary.main",
                                                            color: "primary.contrastText",
                                                            display: "grid",
                                                            placeItems: "center",
                                                            fontWeight: 900,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {t.unread}
                                                    </Box>
                                                ) : null}
                                            </Stack>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>
                </Paper>

                {/* RIGHT: chat */}
                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: theme.palette.background.paper,
                        backgroundImage: "none",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: { xs: 520, md: "calc(100vh - 200px)" },
                        borderColor: theme.palette.surface.border,
                        bgcolor: theme.palette.surface.soft
                    }}
                >
                    {/* chat header */}
                    <Box sx={{ p: 2 }}>
                        {selectedThread ? (
                            <Stack direction="row" alignItems="center" spacing={1.25}>
                                <Avatar src={selectedThread.person.avatar} alt={selectedThread.person.name} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 900 }} noWrap>
                                        {selectedThread.person.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedThread.person.online ? "Active now" : "Offline"}
                                    </Typography>
                                    {selectedThread?.projectTitle && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ cursor: "pointer", textDecoration: "underline" }}
                                            onClick={() =>
                                                navigate(`/projects/${selectedThread.projectId}/${selectedThread.projectSlug}`)
                                            }
                                        >
                                            Project: {selectedThread.projectTitle}
                                        </Typography>
                                    )}
                                </Box>

                                <Tooltip title="Info">
                                    <IconButton
                                        sx={{
                                            border: "1px solid",
                                            borderColor: theme.palette.surface.border,
                                            borderRadius: 2,
                                            bgcolor: theme.palette.surface.soft,
                                        }}
                                    >
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        ) : (
                            <Typography sx={{ fontWeight: 900 }}>Chat</Typography>
                        )}
                    </Box>

                    <Divider sx={{ borderColor: theme.palette.surface.border }} />

                    {/* messages area */}
                    <Box
                        sx={{
                            p: 2,
                            flex: 1,
                            overflowY: "auto",
                            bgcolor: theme.palette.surface.soft,
                        }}
                    >
                        {!selectedThread ? (
                            <EmptyState text="Select a contact to start chatting" />
                        ) : (
                            <Stack spacing={1.25}>
                                {selectedThread.messages.map((m) => {
                                    const mine = m.from === activeRole;

                                    if (m.type === "proposal") {
                                        return (
                                            <Stack key={m.id} sx={{ width: "100%" }} alignItems="center">
                                                <Box sx={{ maxWidth: 720, width: "100%" }}>
                                                    <ProposalMessageCard
                                                        proposal={m.proposal}
                                                        onViewProject={() => goProject(m.proposal)}
                                                        onViewProposal={() => viewProposal(m.proposal)}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
                                                        {m.ts}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        );
                                    }

                                    return <ChatBubble key={m.id} mine={mine} text={m.text} ts={m.ts} />;
                                })}

                                {/* Hint for rule */}
                                {activeRole === "freelancer" && !selectedThread.employerStarted && (
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            borderStyle: "dashed",
                                            bgcolor: theme.palette.surface.strong,
                                            borderColor: theme.palette.surface.border,
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 900 }}>You can’t start this chat yet</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>
                                            In this platform, employers must start the conversation first. Once the employer sends the first
                                            message, you can reply here.
                                        </Typography>
                                    </Paper>
                                )}
                            </Stack>
                        )}
                    </Box>

                    <Divider sx={{ borderColor: theme.palette.surface.border }} />

                    {/* composer */}
                    <Box sx={{ p: 1.5 }}>
                        {selectedThread && attachments.length > 0 && (
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                                {attachments.map((f, idx) => (
                                    <Chip
                                        key={`${f.name}-${f.size}-${idx}`}
                                        label={f.name}
                                        onDelete={() => removeAttachment(idx)}
                                        deleteIcon={<DeleteOutlineRoundedIcon />}
                                        sx={{
                                            borderRadius: 999,
                                            fontWeight: 800,
                                            bgcolor: theme.palette.surface.soft,
                                            border: `1px solid ${theme.palette.surface.border}`,
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}

                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: 999,
                                px: 1.25,
                                py: 0.75,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                borderColor: theme.palette.surface.border,
                                bgcolor: theme.palette.surface.soft,
                            }}
                        >
                            <InputBase
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder={
                                    !selectedThread
                                        ? "Select a contact to enable messaging..."
                                        : !canSend
                                            ? "Waiting for employer to start the chat..."
                                            : "Type a message..."
                                }
                                disabled={!selectedThread || !canSend}
                                sx={{ flex: 1, fontSize: 14 }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />

                            <IconButton
                                onClick={pickAttachments}
                                disabled={!selectedThread || !canSend}
                                sx={{
                                    border: "1px solid",
                                    borderColor: theme.palette.surface.border,
                                    borderRadius: 2,
                                }}
                            >
                                <AttachFileRoundedIcon />
                            </IconButton>

                            <input
                                ref={attachRef}
                                type="file"
                                multiple
                                hidden
                                onChange={(e) => {
                                    addAttachments(e.target.files);
                                    e.target.value = "";
                                }}
                            />

                            <Button
                                onClick={handleSend}
                                disabled={!selectedThread || !canSend || (!draft.trim() && attachments.length === 0)}
                                variant="contained"
                                endIcon={<SendRoundedIcon />}
                                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                            >
                                Send
                            </Button>
                        </Paper>

                        {!selectedThread && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, px: 1 }}>
                                Select a contact to unlock the chat.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
