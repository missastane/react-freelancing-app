import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function Section({ title, subtitle, children }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
        backgroundImage: "none",
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>

      {children}
    </Paper>
  );
}

export default function CreateProjectDialog({
  open,
  onClose,
  onSubmit,
  categories = [],
  maxFiles = 6,
}) {
  const theme = useTheme();
  const inputRef = useRef(null);

  const defaultCategoryId = useMemo(() => categories?.[0]?.id ?? "", [categories]);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setCategoryId(defaultCategoryId);
    setDescription("");
    setDurationDays("");
    setBudgetMin("");
    setBudgetMax("");
    setFiles([]);
    setErrors({});
    setDragOver(false);
  }, [open, defaultCategoryId]);

  const handlePickFiles = () => inputRef.current?.click();

  const mergeFiles = (picked) => {
    if (!picked?.length) return;

    const pickedArr = Array.from(picked);

    // جلوگیری از تکراری (بر اساس name+size)
    const existingKey = new Set(files.map((f) => `${f.name}__${f.size}`));
    const unique = pickedArr.filter((f) => !existingKey.has(`${f.name}__${f.size}`));

    const merged = [...files, ...unique].slice(0, maxFiles);
    setFiles(merged);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!categoryId) e.categoryId = "Please select a category";
    if (!description.trim() || description.trim().length < 20)
      e.description = "Description should be at least 20 characters";

    const d = Number(durationDays);
    if (!d || d <= 0) e.durationDays = "Duration must be a positive number";

    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (!min || min <= 0) e.budgetMin = "Min budget must be positive";
    if (!max || max <= 0) e.budgetMax = "Max budget must be positive";
    if (min && max && max < min) e.budgetMax = "Max budget must be ≥ Min budget";

    if (files.length > maxFiles) e.files = `Max ${maxFiles} files allowed`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      category_id: categoryId,
      description: description.trim(),
      duration_days: Number(durationDays),
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      files, // File[]
    };

    onSubmit?.(payload);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          backgroundImage: "none",
        },
      }}
    >
      {/* Top AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
              Create New Project
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Post your project and start receiving proposals
            </Typography>
          </Box>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
          >
            Publish
          </Button>

          <IconButton onClick={onClose} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            maxWidth: 980,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.65fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* LEFT column */}
          <Stack spacing={2}>
            {/* Basics */}
            <Section title="Project Details" subtitle="Make it clear and specific to attract better proposals.">
              <Stack spacing={2}>
                <TextField
                  label="Project Title"
                  placeholder="e.g. Build a CRM dashboard for a small business"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
                />

                <TextField
                  select
                  label="Category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId}
                  fullWidth
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Description"
                  placeholder="What do you need? Include requirements, deliverables, and any constraints…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
                  minRows={7}
                />
              </Stack>
            </Section>

            {/* Upload */}
            <Section
              title="Attachments"
              subtitle={`Upload files that help freelancers understand the project (up to ${maxFiles}).`}
            >
              <Stack spacing={1.25}>
                <Paper
                  variant="outlined"
                  onClick={handlePickFiles}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);
                    mergeFiles(e.dataTransfer.files);
                  }}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    cursor: "pointer",
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: dragOver ? "primary.main" : "divider",
                    bgcolor:
                      dragOver
                        ? (theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.03)")
                        : (theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)"),
                    transition: "border-color 120ms ease, background-color 120ms ease",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Stack spacing={0.25}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <UploadFileRoundedIcon />
                        <Typography sx={{ fontWeight: 900 }}>
                          Drag & drop files here
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Or click to browse — PDF, DOCX, PNG, JPG…
                      </Typography>
                    </Stack>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickFiles();
                      }}
                      variant="contained"
                      sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
                    >
                      Choose files
                    </Button>
                  </Stack>

                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => {
                      mergeFiles(e.target.files);
                      e.target.value = ""; // انتخاب مجدد همان فایل
                    }}
                  />
                </Paper>

                {!!errors.files && (
                  <Typography variant="body2" color="error">
                    {errors.files}
                  </Typography>
                )}

                {files.length > 0 && (
                  <>
                    <Divider />
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {files.map((f, idx) => (
                        <Chip
                          key={`${f.name}-${f.size}-${idx}`}
                          label={`${f.name} • ${formatBytes(f.size)}`}
                          onDelete={() => removeFile(idx)}
                          deleteIcon={<DeleteOutlineRoundedIcon />}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 800,
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.06)"
                                : "rgba(0,0,0,0.05)",
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            </Section>
          </Stack>

          {/* RIGHT column */}
          <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
            <Section title="Budget & Timeline" subtitle="Set realistic expectations to get better offers.">
              <Stack spacing={2}>
                <TextField
                  label="Duration (days)"
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  error={!!errors.durationDays}
                  helperText={errors.durationDays}
                  inputProps={{ min: 1 }}
                  fullWidth
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <TextField
                    label="Min budget ($)"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    error={!!errors.budgetMin}
                    helperText={errors.budgetMin}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                  <TextField
                    label="Max budget ($)"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    error={!!errors.budgetMax}
                    helperText={errors.budgetMax}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Box>

                <Divider />

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Tip: adding clear budget and timeline increases proposal quality.
                </Typography>
              </Stack>
            </Section>

            <Section title="Preview" subtitle="How your project will appear to freelancers.">
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 900 }}>
                  {title.trim() ? title.trim() : "Project title"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {categories.find((c) => c.id === categoryId)?.name || "Category"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Budget: {budgetMin || "—"} – {budgetMax || "—"} • {durationDays || "—"} days
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.8,
                  }}
                >
                  {description.trim() ? description.trim() : "Your description will appear here…"}
                </Typography>

                {files.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Attachments: {files.length}
                  </Typography>
                )}
              </Stack>
            </Section>
          </Stack>
        </Box>

        {/* Bottom actions (for ergonomics) */}
        <Box sx={{ maxWidth: 980, mx: "auto", mt: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              backgroundImage: "none",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              borderColor: "divider",
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Publish Project
            </Button>
          </Paper>
        </Box>
      </Box>
    </Dialog>
  );
}
