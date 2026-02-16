import React from "react";
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
} from "@mui/material";

const statusMap = {
  1: { label: "Pending", color: "warning" },
  2: { label: "Approved", color: "success" },
  3: { label: "Rejected", color: "error" },
  4: { label: "Withdrawn", color: "default" },
};

export default function ProposalDetailsDialog({ open, onClose, proposal, onApprove, onReject,fullScreen }) {
  if (!proposal) return null;

  const status = statusMap[proposal.status] ?? statusMap[1];
  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 900 }}>
            Proposal Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {proposal.project?.title || "Project"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
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

            <Chip label={status.label} color={status.color} sx={{ fontWeight: 900 }} />
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Bid</Typography>
              <Typography sx={{ fontWeight: 900 }}>${proposal.amount}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography color="text.secondary">Duration</Typography>
              <Typography sx={{ fontWeight: 900 }}>{proposal.durationDays} days</Typography>
            </Stack>
          </Paper>

          <Box>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Message</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
              {proposal.details}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Milestones</Typography>
            <Stack spacing={1}>
              {proposal.milestones?.map((m, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
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

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>
              Close
            </Button>

            <Button
              onClick={() => onReject?.(proposal.id)}
              color="error"
              variant="outlined"
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Reject
            </Button>

            <Button
              onClick={() => onApprove?.(proposal.id)}
              color="success"
              variant="contained"
              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}
            >
              Approve
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
