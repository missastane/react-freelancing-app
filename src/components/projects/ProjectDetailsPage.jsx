import React, { useMemo } from "react";
import { Box, Container, Paper, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import ProjectDetailsContent from "./ProjectDetailsContent";

function useMockProject(id) {
  return useMemo(() => {
    const pid = Number(id);
    const data = {
      11: {
        id: 11,
        title: "Develop a Custom CRM System",
        postedAt: "2 days ago",
        level: "Intermediate",
        budgetMin: 1500,
        budgetMax: 2500,
        description: "Need a CRM with customer pipeline, tasks, and reporting.",
        longDescription:
          "Need a CRM with customer pipeline, tasks, and reporting.\n\nTech stack preferred: Laravel + React.\nDeliverables: auth, dashboard, roles, and clean API.",
        skills: [{ original_title: "React" }, { original_title: "Laravel" }, { original_title: "MySQL" }],
        client: { name: "Michel", location: "Berlin, DE" },
      },
    };
    return data[pid] || null;
  }, [id]);
}

export default function ProjectDetailsPage() {
  const theme = useTheme();
  const { id } = useParams();
  const project = useMockProject(id);

  return (
    <Box sx={{ py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: 3,

            // ✅ هماهنگ با سیستم surface صفحه پروژه‌ها
            borderColor: theme.palette.surface.border,
            bgcolor: theme.palette.surface.soft,
            backgroundImage: `linear-gradient(180deg, ${theme.palette.surface.tint}, transparent)`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <ProjectDetailsContent
            project={project}
            showClose={false} // ✅ صفحه‌ست، دکمه Close نذاریم
            onSubmitProposal={(p) => console.log("Submit proposal for:", p)}
          />
        </Paper>
      </Container>
    </Box>
  );
}
