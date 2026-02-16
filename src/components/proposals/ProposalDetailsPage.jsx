import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import ProposalDialog from "../projects/freelancer/ProposalDialog"; // مسیرش رو خودت درست کن

// TODO: بعداً API واقعی
async function fetchProposal(id) {
    // mock
    return {
        id,
        status: "pending",
        project_id: 12,
        project: {
            id: 12,
            title: "Landing Page in React + MUI",
            postedAt: "2026-02-12",
            level: "Mid",
            budgetMin: 300,
            budgetMax: 600,
            skills: ["React", "MUI"],
            client: { name: "Acme Studio" },
            longDescription: "Build a landing page…",
        },
        milestones: [
            { title: "UI", description: "Build UI", budget: 200, durationDays: 2 },
            { title: "Integration", description: "Connect API", budget: 150, durationDays: 2 },
        ],
        overall_deadline: "2026-03-01",
        details: "I will deliver…",
    };
}

async function updateProposal(id, payload) {
    console.log("UPDATE", id, payload);
}

export default function ProposalViewPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [proposal, setProposal] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        fetchProposal(id).then(setProposal);
    }, [id]);

    const canEdit = useMemo(() => proposal?.status === "pending", [proposal]);

    if (!proposal) return null;

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap">
                <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
                        Proposal #{proposal.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {proposal.project?.title} • {proposal.project?.client?.name}
                    </Typography>

                    <Stack direction="row" gap={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Chip size="small" label={proposal.status} variant="outlined" sx={{ borderColor: theme.palette.divider }} />
                        <Chip size="small" label={`Deadline: ${proposal.overall_deadline}`} variant="outlined" sx={{ borderColor: theme.palette.divider }} />
                    </Stack>
                </Box>

                <Stack direction="row" gap={1}>
                    <Button variant="outlined" onClick={() => navigate("/proposals")} sx={{ borderRadius: 2, borderColor: theme.palette.divider }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!canEdit}
                        onClick={() => setOpenEdit(true)}
                        sx={{ borderRadius: 2, fontWeight: 900 }}
                    >
                        Edit
                    </Button>
                </Stack>
            </Stack>

            {/* نمایش جزئیات */}
            <Paper variant="outlined" sx={{ mt: 2, p: 2.5, borderRadius: 3, borderColor: theme.palette.divider }}>
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Milestones</Typography>
                <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

                <Stack spacing={1.25}>
                    {proposal.milestones.map((m, i) => (
                        <Paper
                            key={i}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                borderColor: theme.palette.divider,
                                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 900 }}>
                                {i + 1}. {m.title} — ${m.budget} ({m.durationDays} days)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>
                                {m.description}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>

                <Divider sx={{ my: 2.5, borderColor: theme.palette.divider }} />

                <Typography sx={{ fontWeight: 900 }}>Details</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                    {proposal.details}
                </Typography>
            </Paper>

            {/* Edit dialog (Reuse) */}
            <ProposalDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                mode="edit"
                project={proposal.project}
                initialValues={proposal}
                submitLabel="Save changes"
                onSubmit={(payload) => proposalService.update(proposal.id, payload)}
            />

        </Box>
    );
}
