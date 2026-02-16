import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import ProposalDetailsDialog from "./ProposalDetailsDialog";
import { getSkillChipSx } from "../../../utils/skillColors";
import CreateProjectDialog from "./CreateProjectDialog";

const statusChipSx = (theme, status) => {
  const isDark = theme.palette.mode === "dark";
  const map = {
    open: { label: "Open", color: "success" },
    closed: { label: "Closed", color: "default" },
    draft: { label: "Draft", color: "warning" },
  };
  const meta = map[status] ?? map.open;

  return {
    label: meta.label,
    sx: {
      borderRadius: 999,
      fontWeight: 900,
      bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    },
  };
};

export default function MyProjectsPage() {
  const theme = useTheme();

  // ✅ mock data (بعداً از API)
  const projects = useMemo(
    () => [
      {
        id: 11,
        title: "Develop a Custom CRM System",
        status: "open",
        budgetMin: 1500,
        budgetMax: 2500,
        proposalsCount: 5,
        tags: ["React", "Laravel", "MySQL"],
      },
      {
        id: 12,
        title: "Build a Website for an E-Commerce Store",
        status: "closed",
        budgetMin: 500,
        budgetMax: 800,
        proposalsCount: 2,
        tags: ["React", "Payments", "Responsive"],
      },
      {
        id: 13,
        title: "Create a Mobile App for Fitness Tracking",
        status: "draft",
        budgetMin: 3000,
        budgetMax: 5000,
        proposalsCount: 0,
        tags: ["React Native", "API", "UI/UX"],
      },
    ],
    []
  );

  // پیشنهادهای مربوط به پروژه انتخاب‌شده
  const proposalsByProject = useMemo(
    () => ({
      11: [
        {
          id: 201,
          freelancer: {
            name: "JaneDesigns",
            avatar: "https://i.pravatar.cc/120?img=47",
            rating: 4.9,
            reviews: 25,
          },
          amount: 2000,
          durationDays: 14,
          status: 1, // pending
          details:
            "I will deliver a fully functional CRM with clean architecture, tests, and a responsive UI. Milestones included.",
          milestones: [
            { title: "Initial System Design", amount: 1000, days: 7 },
            { title: "Module Development", amount: 1000, days: 7 },
          ],
        },
        {
          id: 202,
          freelancer: {
            name: "DevMaster",
            avatar: "https://i.pravatar.cc/120?img=12",
            rating: 4.6,
            reviews: 10,
          },
          amount: 1800,
          durationDays: 10,
          status: 1,
          details: "Fast delivery with weekly checkpoints. Includes deployment guidance.",
          milestones: [{ title: "Core Modules", amount: 1800, days: 10 }],
        },
      ],
      12: [
        {
          id: 301,
          freelancer: {
            name: "PixelPro",
            avatar: "https://i.pravatar.cc/120?img=33",
            rating: 4.7,
            reviews: 18,
          },
          amount: 650,
          durationDays: 7,
          status: 2, // approved
          details: "E-commerce website with Stripe integration and admin panel.",
          milestones: [{ title: "Website + Payments", amount: 650, days: 7 }],
        },
      ],
    }),
    []
  );

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const proposals = selectedProjectId ? proposalsByProject[selectedProjectId] || [] : [];
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileProposalsOpen, setMobileProposalsOpen] = useState(false);

    const onEditProject = (projectId) => console.log("Edit project", projectId);
  const onDeleteProject = (projectId) => console.log("Delete project", projectId);
  const onViewProjectProposals = (projectId) => console.log("Go to proposals list", projectId);

  const onApprove = (proposalId) => console.log("Approve proposal", proposalId);
  const onReject = (proposalId) => console.log("Reject proposal", proposalId);
const [createOpen, setCreateOpen] = useState(false);

const categories = useMemo(
  () => [
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Apps" },
    { id: "design", name: "Design" },
    { id: "content", name: "Content Writing" },
  ],
  []
);

const onCreateProject = () => setCreateOpen(true);

const handleCreateProject = (payload) => {
  console.log("CREATE PROJECT payload:", payload);
  // بعداً: API call
};

  return (
    <Box sx={{ py: { xs: 3, sm: 4 }, overflowX: "hidden" }}>
      <Container maxWidth="lg">
        {/* Header + CTA */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
              My Projects
            </Typography>
            <Typography color="text.secondary">
              Manage your projects and review incoming proposals.
            </Typography>
          </Box>

          {/* ✅ CTA ایجاد پروژه جدید همینجاست */}
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateProject}
            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          >
            Create Project
          </Button>
        </Stack>

        {/* Empty state */}
        {projects.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>No projects yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Create your first project and start receiving proposals.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={onCreateProject}
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Create Project
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.55fr 0.9fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            {/* LEFT: Projects list */}
            <Stack spacing={2} sx={{
              maxWidth: { xs: 350, md: "100%" },
              mx: { xs: "auto", md: 0 }, // وسط‌چین تو موبایل
            }}>
              {projects.map((p) => {
                const chip = statusChipSx(theme, p.status);

                return (
                  <Paper
                    key={p.id}
                    variant="outlined"
                    onClick={() => setSelectedProjectId(p.id)}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 3,
                      cursor: "pointer",
                      borderColor: selectedProjectId === p.id ? "primary.main" : "divider",
                      transition: "border-color 120ms ease",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900 }} noWrap>
                          {p.title}
                        </Typography>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                          {p.tags.map((t) => (
                            <Chip
                              key={t}
                              label={t}
                              sx={getSkillChipSx(theme, t)}
                            />
                          ))}
                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 1.25 }}>
                          Budget: ${p.budgetMin} – ${p.budgetMax}
                        </Typography>
                      </Box>

                      <Stack alignItems="flex-end" spacing={1}>
                        <Chip {...chip} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                          {p.proposalsCount} proposals
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1} justifyContent="flex-end" useFlexGap flexWrap="wrap">
                      {isMobile && (
                        <Button
                          size="small"
                          startIcon={<ListAltRoundedIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProjectId(p.id);
                            setMobileProposalsOpen(true);
                          }}
                          variant="contained"
                          sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                        >
                          View Proposals
                        </Button>
                      )}


                      <Button
                        size="small"
                        startIcon={<EditRoundedIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(p.id);
                        }}
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(p.id);
                        }}
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>

            {/* RIGHT: Proposals sidebar */}
            {!isMobile && (<Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                position: { md: "sticky" },
                top: { md: 88 },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Proposals
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {selectedProject ? `For: ${selectedProject.title}` : "Select a project"}
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {proposals.length === 0 ? (
                <Typography color="text.secondary">
                  No proposals yet.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {proposals.map((pr) => (
                    <Paper
                      key={pr.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar src={pr.freelancer.avatar} alt={pr.freelancer.name} />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 900 }} noWrap>
                            {pr.freelancer.name}
                          </Typography>

                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Rating value={pr.freelancer.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {pr.freelancer.rating} ({pr.freelancer.reviews})
                            </Typography>
                          </Stack>
                        </Box>

                        <Box sx={{ textAlign: "right" }}>
                          <Typography sx={{ fontWeight: 900 }}>${pr.amount}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pr.durationDays} days
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.25 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setSelectedProposal({ ...pr, project: selectedProject })}
                          sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
            )}

          </Box>
        )}
      </Container>
      <Drawer
        anchor="right"
        open={mobileProposalsOpen}
        onClose={() => setMobileProposalsOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 520,
            bgcolor: "background.default",
            backgroundImage: "none",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => setMobileProposalsOpen(false)}>
              <ArrowBackRoundedIcon />
            </IconButton>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900 }} noWrap>
                Proposals
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {selectedProject ? `For: ${selectedProject.title}` : "Select a project"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {proposals.length === 0 ? (
            <Typography color="text.secondary">No proposals yet.</Typography>
          ) : (
            <Stack spacing={1.25}>
              {proposals.map((pr) => (
                <Paper
                  key={pr.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar src={pr.freelancer.avatar} alt={pr.freelancer.name} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900 }} noWrap>
                        {pr.freelancer.name}
                      </Typography>

                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Rating value={pr.freelancer.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {pr.freelancer.rating} ({pr.freelancer.reviews})
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontWeight: 900 }}>${pr.amount}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pr.durationDays} days
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.25 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setSelectedProposal({ ...pr, project: selectedProject })}
                      sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Proposal details dialog */}
      <ProposalDetailsDialog
      fullScreen={isMobile}
        open={Boolean(selectedProposal)}
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onApprove={(id) => {
          onApprove(id);
          setSelectedProposal(null);
        }}
        onReject={(id) => {
          onReject(id);
          setSelectedProposal(null);
        }}
      />

      <CreateProjectDialog
  open={createOpen}
  onClose={() => setCreateOpen(false)}
  onSubmit={handleCreateProject}
  categories={categories}
/>

    </Box>
  );
}
