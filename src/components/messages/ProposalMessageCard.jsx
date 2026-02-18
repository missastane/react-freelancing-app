import React from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

export default function ProposalMessageCard({ proposal, onViewProject, onViewProposal }) {
  const theme = useTheme();
  if (!proposal) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "transparent",
        backgroundImage: "none",
        borderColor: theme.palette.surface.border,
      }}
    >
      <Box sx={{ p: 1.75 }}>
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontWeight: 900 }} noWrap>
              Proposal Submitted
            </Typography>

            <Chip
              label={proposal.statusLabel || "Pending"}
              sx={{
                borderRadius: 999,
                fontWeight: 900,
                bgcolor: theme.palette.surface.soft,
                border: `1px solid ${theme.palette.surface.border}`,
              }}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Project:{" "}
            <Box component="span" sx={{ fontWeight: 900, color: "text.primary" }}>
              {proposal.projectTitle || "—"}
            </Box>
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={`Budget: $${proposal.amount}`}
              sx={{
                borderRadius: 999,
                fontWeight: 800,
                bgcolor: theme.palette.surface.soft,
                border: `1px solid ${theme.palette.surface.border}`,
              }}
            />
            <Chip
              label={`Duration: ${proposal.durationDays} days`}
              sx={{
                borderRadius: 999,
                fontWeight: 800,
                bgcolor: theme.palette.surface.soft,
                border: `1px solid ${theme.palette.surface.border}`,
              }}
            />
          </Stack>

          {!!proposal.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>
              {proposal.note}
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: theme.palette.surface.border }} />

      <Stack direction="row" spacing={1} sx={{ p: 1.25, justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInNewRoundedIcon />}
          onClick={onViewProject}
          sx={{
            borderRadius: 2.5,
            fontWeight: 900,
            textTransform: "none",
            borderColor: theme.palette.surface.border,
            "&:hover": { borderColor: theme.palette.surface.borderTint },
          }}
        >
          View Project
        </Button>

        <Button
          size="small"
          variant="contained"
          startIcon={<DescriptionRoundedIcon />}
          onClick={onViewProposal}
          sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
        >
          View Proposal
        </Button>
      </Stack>
    </Paper>
  );
}
