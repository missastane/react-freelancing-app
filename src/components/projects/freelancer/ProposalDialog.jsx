import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { getSkillChipSx, getSkillKey } from "../../../utils/skillColors";

const FEE_PERCENT = 10;

function emptyMilestone() {
  return { title: "", description: "", budget: "", durationDays: "" };
}

function normalizeMilestones(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [emptyMilestone()];
  return raw.map((m) => ({
    title: m?.title ?? "",
    description: m?.description ?? "",
    budget: String(m?.budget ?? ""),
    durationDays: String(m?.durationDays ?? m?.duration_days ?? ""),
  }));
}

export default function ProposalDialog({
  open,
  onClose,
  mode = "create",
  project,
  initialValues,
  onSubmit,
  submitLabel,
}) {
  const theme = useTheme();

  const [showSummary, setShowSummary] = useState(true);

  // form state
  const [milestones, setMilestones] = useState([emptyMilestone()]);
  const [overallDeadline, setOverallDeadline] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) return;

    setShowSummary(true);

    if (mode === "edit" && initialValues) {
      setMilestones(normalizeMilestones(initialValues.milestones));
      setOverallDeadline(initialValues.overall_deadline || "");
      setDetails(initialValues.details || "");
      return;
    }

    setMilestones([emptyMilestone()]);
    setOverallDeadline("");
    setDetails("");
  }, [open, mode, project?.id, initialValues]);

  const totals = useMemo(() => {
    const total = milestones.reduce((sum, m) => sum + (Number(m.budget) || 0), 0);
    const fee = Math.round(((total * FEE_PERCENT) / 100) * 100) / 100;
    const earn = Math.round((total - fee) * 100) / 100;
    return { total, fee, earn };
  }, [milestones]);

  const canSubmit = useMemo(() => {
    if (!milestones.length) return false;

    const anyValid = milestones.some(
      (m) =>
        m.title.trim() &&
        m.description.trim() &&
        Number(m.budget) > 0 &&
        Number(m.durationDays) > 0
    );

    return anyValid && details.trim().length >= 10 && !!overallDeadline;
  }, [milestones, details, overallDeadline]);

  const addMilestone = () => setMilestones((prev) => [...prev, emptyMilestone()]);

  const removeMilestone = (idx) =>
    setMilestones((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));

  const updateMilestone = (idx, patch) =>
    setMilestones((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));

  const titleText = mode === "edit" ? "Proposal" : "Submit Proposal";
  const actionText = submitLabel || (mode === "edit" ? "Save changes" : "Submit Proposal");

  const summarySubtitle = useMemo(() => {
    if (project) return `For ${project?.client?.name || "Client"}`;
    if (initialValues?.project?.client?.name) return `For ${initialValues.project.client.name}`;
    return "—";
  }, [project, initialValues]);

  const handleSubmit = async () => {
    const payload = {
      project_id: project?.id ?? initialValues?.project_id ?? initialValues?.project?.id,
      milestones: milestones.map((m) => ({
        title: m.title.trim(),
        description: m.description.trim(),
        budget: Number(m.budget) || 0,
        durationDays: Number(m.durationDays) || 0,
      })),
      overall_deadline: overallDeadline,
      details: details.trim(),
      totals,
      fee_percent: FEE_PERCENT,
    };

    await onSubmit?.(payload);
    onClose?.();
  };

  // ✅ unified surfaces
  const paperSx = {
    borderRadius: 3,
    borderColor: theme.palette.surface.border,
    bgcolor: theme.palette.surface.soft,
    backgroundImage: "none",
    p:2
  };

  const innerSoftSx = {
    borderRadius: 3,
    borderColor: theme.palette.surface.border,
    bgcolor: theme.palette.surface.soft,
    backgroundImage: "none",
  };

  const innerStrongSx = {
    borderRadius: 3,
    borderColor: theme.palette.surface.borderTint,
    bgcolor: theme.palette.surface.strong,
    backgroundImage: "none",
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.surface.soft,
          backgroundImage: `linear-gradient(180deg, ${theme.palette.surface.tint}, transparent)`,
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      {/* Top bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: theme.palette.surface.strong,
          borderBottom: "1px solid",
          borderColor: theme.palette.surface.border,
          backgroundImage: "none",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={onClose} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
              {titleText}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {summarySubtitle}
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          >
            {actionText}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ py: 2.5 }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            {/* Project summary FULL WIDTH */}
            <Paper variant="outlined" sx={{ ...paperSx }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900 }} noWrap>
                    {project?.title || initialValues?.project?.title || "Project"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {project
                      ? `${project.postedAt} • ${project.level} • $${project.budgetMin}–$${project.budgetMax}`
                      : initialValues?.project
                      ? `${initialValues.project.postedAt || "—"} • ${initialValues.project.level || "—"} • ${
                          initialValues.project.budgetMin != null && initialValues.project.budgetMax != null
                            ? `$${initialValues.project.budgetMin}–$${initialValues.project.budgetMax}`
                            : "—"
                        }`
                      : "—"}
                  </Typography>
                </Box>

                <IconButton onClick={() => setShowSummary((s) => !s)} aria-label="toggle summary">
                  <ExpandMoreRoundedIcon
                    sx={{
                      transform: showSummary ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 150ms ease",
                    }}
                  />
                </IconButton>
              </Stack>

              <Collapse in={showSummary} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2, borderColor: theme.palette.surface.border }} />

                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {(project?.skills || initialValues?.project?.skills || []).map((skill) => (
                      <Chip
                        key={getSkillKey(skill)}
                        label={
                          typeof skill === "string"
                            ? skill
                            : skill.original_title || skill.persian_title || skill.name
                        }
                        sx={getSkillChipSx(theme, skill)}
                      />
                    ))}
                  </Stack>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
                    {project?.longDescription ||
                      project?.description ||
                      initialValues?.project?.longDescription ||
                      initialValues?.project?.description ||
                      "—"}
                  </Typography>
                </Stack>
              </Collapse>
            </Paper>

            {/* Milestones + Right Sidebar row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.6fr 0.8fr" },
                gap: 2,
                alignItems: "start",
              }}
            >
              {/* LEFT: Milestones */}
              <Paper variant="outlined" sx={{ ...paperSx, p: { xs: 2, sm: 2.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    Milestones
                  </Typography>

                  <Button
                    startIcon={<AddRoundedIcon />}
                    onClick={addMilestone}
                    variant="outlined"
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 800,
                      textTransform: "none",
                      borderColor: theme.palette.surface.border,
                      "&:hover": { borderColor: theme.palette.surface.borderTint },
                    }}
                  >
                    Add milestone
                  </Button>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add at least one milestone. Each milestone needs title, description, budget and duration.
                </Typography>

                <Stack spacing={2}>
                  {milestones.map((m, idx) => (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        ...innerSoftSx,
                        p: 2,
                        transition: "border-color 140ms ease, background-color 140ms ease",
                        "&:hover": {
                          borderColor: theme.palette.surface.borderTint,
                          bgcolor: theme.palette.surface.strong,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5} sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 900 }}>Milestone {idx + 1}</Typography>

                        <IconButton
                          onClick={() => removeMilestone(idx)}
                          disabled={milestones.length === 1}
                          aria-label="remove milestone"
                          size="small"
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack spacing={1.5}>
                        <TextField
                          label="Title"
                          value={m.title}
                          onChange={(e) => updateMilestone(idx, { title: e.target.value })}
                          fullWidth
                        />

                        <TextField
                          label="Description"
                          value={m.description}
                          onChange={(e) => updateMilestone(idx, { description: e.target.value })}
                          fullWidth
                          multiline
                          minRows={2}
                        />

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 1.5,
                          }}
                        >
                          <TextField
                            label="Budget ($)"
                            type="number"
                            value={m.budget}
                            onChange={(e) => updateMilestone(idx, { budget: e.target.value })}
                            fullWidth
                            inputProps={{ min: 0 }}
                          />

                          <TextField
                            label="Duration (days)"
                            type="number"
                            value={m.durationDays}
                            onChange={(e) => updateMilestone(idx, { durationDays: e.target.value })}
                            fullWidth
                            inputProps={{ min: 1 }}
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              {/* RIGHT: Deadline + Fee (sticky) */}
              <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
                <Paper variant="outlined" sx={{ ...paperSx, p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
                    Overall deadline
                  </Typography>

                  <TextField
                    label="Delivery date"
                    type="date"
                    value={overallDeadline}
                    onChange={(e) => setOverallDeadline(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                    This is the final delivery date for the whole project.
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ ...paperSx, p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
                    Summary
                  </Typography>

                  <Stack spacing={1}>
                    <Row label="Total amount" value={`$${totals.total.toFixed(2)}`} strong />
                    <Row label={`Service fee (${FEE_PERCENT}%)`} value={`-$${totals.fee.toFixed(2)}`} />
                    <Divider sx={{ borderColor: theme.palette.surface.border }} />
                    {/* ✅ accent با پالت خودت (نه سبز success) */}
                    <Row label="You will earn" value={`$${totals.earn.toFixed(2)}`} accent />
                  </Stack>
                </Paper>
              </Stack>
            </Box>

            {/* Proposal details FULL WIDTH */}
            <Paper variant="outlined" sx={{ ...paperSx, p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
                Proposal details
              </Typography>

              <TextField
                placeholder="Describe your approach, timeline, what’s included, questions for the client, etc."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                fullWidth
                multiline
                minRows={6}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
                Tip: include what you’ll deliver per milestone to reduce misunderstandings.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 800,
                    textTransform: "none",
                    borderColor: theme.palette.surface.border,
                    "&:hover": { borderColor: theme.palette.surface.borderTint },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                >
                  {actionText}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Dialog>
  );
}

function Row({ label, value, strong, accent }) {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontWeight: strong || accent ? 900 : 800,
          // ✅ accent با رنگ برند خودت
          color: accent ? theme.palette.primary.main : "text.primary",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
