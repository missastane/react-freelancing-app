import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { getSkillChipSx,getSkillKey } from "../../utils/skillColors";
export default function ProjectDetailsContent({
  project,
  onClose,
  onSubmitProposal,
  showClose = true,
}) {
  const theme = useTheme();
  if (!project) return null;

  return (
    <Stack spacing={2.2}>
      {/* Title */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }} gutterBottom>
            {project.title}
          </Typography>
          <Typography color="text.secondary">
            {project.postedAt} • {project.level}
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 900, whiteSpace: "nowrap" }}>
          Budget: ${project.budgetMin} – ${project.budgetMax}
        </Typography>
      </Stack>

      <Divider />

      {/* Description */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
          Description
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
          {project.longDescription || project.description}
        </Typography>
      </Box>

      {/* Skills */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
          Skills Required
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {(project.skills || []).map((skill) => (
            <Chip
              key={getSkillKey(skill)}
              label={
                typeof skill === "string"
                  ? skill
                  : (skill.original_title || skill.persian_title || skill.name)
              }
              sx={getSkillChipSx(theme, skill)}
            />
          ))}
        </Stack>
      </Box>

      {/* Client */}
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
        }}
      >
        <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Client</Typography>
        <Typography color="text.secondary">
          {project.client?.name} • {project.client?.location}
        </Typography>
      </Box>

      {/* Actions */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="flex-end">
        {showClose && (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
          >
            Close
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => onSubmitProposal?.(project)}
          sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 900 }}
        >
          Submit Proposal
        </Button>
      </Stack>
    </Stack>
  );
}
