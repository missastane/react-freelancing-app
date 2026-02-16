import React, { useMemo, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import ProjectCard from "../ProjectCard";
import ProjectDetailsModal from "./ProjectDetailsModal";
import SubmitProposalDialog from "./SubmitProposalDialog";

export default function ProjectsPage() {
   const projects = useMemo(
    () => [
      {
        id: 1,
        title: "Build a Website for an E-Commerce Store",
        description:
          "Looking for an experienced developer to create an e-commerce website with payment integration and responsive design.",
        postedAt: "Posted 2 hours ago",
        level: "Intermediate Level",
        budgetMin: 500,
        budgetMax: 800,
        proposals: 3,
        skills: ["React", "Laravel", "JavaScript", "HTML", "Payment Gateway"],
        client: {
          name: "SarahMDev",
          location: "United States",
          avatar: "https://i.pravatar.cc/120?img=12",
        },
      },
      {
        id: 2,
        title: "Dashboard UI with React + MUI",
        description:
          "Need a clean dashboard (charts, tables, responsive layout). Theme should support dark/light + accent color.",
        postedAt: "Posted 1 day ago",
        level: "Expert Level",
        budgetMin: 900,
        budgetMax: 1500,
        proposals: 7,
        skills: ["React", "MUI", "UX", "Charts", "Responsive"],
        client: {
          name: "UpNorth Studio",
          location: "Germany",
          avatar: "https://i.pravatar.cc/120?img=32",
        },
      },
      {
        id: 3,
        title: "Laravel API for Freelance Platform",
        description:
          "Design REST API endpoints for projects, proposals, profiles. JWT auth. Clean architecture + validations.",
        postedAt: "Posted 3 days ago",
        level: "Intermediate Level",
        budgetMin: 700,
        budgetMax: 1200,
        proposals: 12,
        skills: ["Laravel", "JWT", "REST API", "MySQL", "Testing"],
        client: {
          name: "Moonlight LLC",
          location: "Canada",
          avatar: "https://i.pravatar.cc/120?img=45",
        },
      },
    ],
    []
  );

  const [selected, setSelected] = useState(null);
  const [proposalProject, setProposalProject] = useState(null);

  const openDetails = (p) => setSelected(p);
  const closeDetails = () => setSelected(null);

  const openProposal = (p) => {
    // ✅ مودال جزئیات بسته بشه و پیشنهاد باز بشه
    setSelected(null);
    setProposalProject(p);
  };
  const closeProposal = () => setProposalProject(null);

  return (
    <Box sx={{ py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse available projects and start bidding.
          </Typography>
        </Stack>

        <Stack spacing={2.25}>
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onView={() => openDetails(p)} />
          ))}
        </Stack>

        <ProjectDetailsModal
          open={Boolean(selected)}
          project={selected}
          onClose={closeDetails}
          onSubmitProposal={openProposal}
        />

        <SubmitProposalDialog
          open={Boolean(proposalProject)}
          project={proposalProject}
          onClose={closeProposal}
        />
      </Container>
    </Box>
  );
}
