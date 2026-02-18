import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const statusMap = {
  1: { label: "Pending" },
  2: { label: "Approved" },
  3: { label: "Rejected" },
  4: { label: "Withdrawn" },
};

// چیپ وضعیت: هماهنگ با surface (کم‌صدا، حرفه‌ای)
function getStatusChipProps(theme, statusCode) {
  const meta = statusMap[statusCode] ?? statusMap[1];

  // برای تفاوت خیلی ملایم بین وضعیت‌ها، فقط borderTint رو کم/زیاد می‌کنیم
  const borderByStatus = {
    1: theme.palette.surface.borderTint, // pending
    2: theme.palette.surface.borderTint, // approved
    3: theme.palette.surface.borderTint, // rejected
    4: theme.palette.surface.border,     // withdrawn
  };

  return {
    label: meta.label,
    variant: "outlined",
    sx: {
      borderRadius: 999,
      fontWeight: 900,
      bgcolor: theme.palette.action.selected,
      borderColor: borderByStatus[statusCode] ?? theme.palette.surface.border,
    },
  };
}

export default function ProposalDetailsDialog({
  open,
  onClose,
  proposal,
  onApprove,
  onReject,
  fullScreen,
}) {
  const theme = useTheme();
  if (!proposal) return null;

  const statusChip = useMemo(
    () => getStatusChipProps(theme, proposal.status),
    [theme, proposal.status]
  );

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          overflow: "hidden",
          // ✅ هماهنگ با صفحه پروژه‌ها
          bgcolor: theme.palette.surface.soft,
          border: "1px solid",
          borderColor: theme.palette.surface.border,
          backgroundImage: "none",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "1px solid",
          borderColor: theme.palette.surface.border,
          // کمی تأکید روی هدر (ولی نه جیغ)
          bgcolor: theme.palette.surface.strong,
        }}
      >
        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 900 }}>Proposal Details</Typography>
          <Typography variant="body2" color="text.secondary">
            {proposal.project?.title || "Project"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.25 }}>
        <Stack spacing={2}>
          {/* Freelancer row */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={proposal.freelancer.avatar} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900 }} noWrap>
                {proposal.freelancer.name}
              </Typography>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <Rating value={proposal.freelancer.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {proposal.freelancer.rating} ({proposal.freelancer.reviews})
                </Typography>
              </Stack>
            </Box>

            <Chip {...statusChip} />
          </Stack>

          {/* Bid / Duration */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: theme.palette.action.selected,
              borderColor: theme.palette.surface.border,
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Bid</Typography>
              <Typography sx={{ fontWeight: 900 }}>${proposal.amount}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography color="text.secondary">Duration</Typography>
              <Typography sx={{ fontWeight: 900 }}>{proposal.durationDays} days</Typography>
            </Stack>
          </Paper>

          {/* Message */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              borderColor: theme.palette.surface.border,
            }}
          >
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Message</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
              {proposal.details}
            </Typography>
          </Paper>

          <Divider sx={{ borderColor: theme.palette.surface.border }} />

          {/* Milestones */}
          <Box>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Milestones</Typography>

            <Stack spacing={1}>
              {proposal.milestones?.map((m, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: theme.palette.action.selected,
                    borderColor: theme.palette.surface.border,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 900 }}>{m.title}</Typography>
                    <Typography sx={{ fontWeight: 900 }}>${m.amount}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {m.days} days
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end" useFlexGap flexWrap="wrap">
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 2.5,
                fontWeight: 800,
                textTransform: "none",
                borderColor: theme.palette.surface.border,
                "&:hover": { borderColor: theme.palette.surface.borderTint },
              }}
            >
              Close
            </Button>

            <Button
              onClick={() => onReject?.(proposal.id)}
              color="error"
              variant="outlined"
              sx={{
                borderRadius: 2.5,
                fontWeight: 900,
                textTransform: "none",
                // ✅ حتی error هم با borderها هماهنگ باشه
                borderColor: theme.palette.surface.border,
              }}
            >
              Reject
            </Button>

            <Button
              onClick={() => onApprove?.(proposal.id)}
              variant="contained"
              sx={{
                borderRadius: 2.5,
                fontWeight: 900,
                textTransform: "none",
                // ✅ به جای success (که ممکنه با پالت قاطی شود)، از primary برند استفاده کن
                // اگر واقعاً می‌خوای سبز باشه بگو تا مثل success نگه داریم
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              Approve
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
