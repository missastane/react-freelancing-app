import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ProjectDetailsContent from "../ProjectDetailsContent";

export default function ProjectDetailsModal({
  open,
  onClose,
  project,
  onSubmitProposal,
}) {
  const theme = useTheme();

  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid",
          borderColor: theme.palette.surface.border,

          // ✅ هماهنگ با صفحه پروژه‌ها
          bgcolor: theme.palette.surface.soft,
          backgroundImage: `linear-gradient(180deg, ${theme.palette.surface.tint}, transparent)`,
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          pb: 1,
          bgcolor: theme.palette.surface.strong,
          borderBottom: "1px solid",
          borderColor: theme.palette.surface.border,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
            {project.title}
          </Typography>

          <Button onClick={onClose} variant="text" sx={{ minWidth: 40, borderRadius: 2 }}>
            <CloseRoundedIcon />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* اگر داخل ProjectDetailsContent هم Paper/Divider داری که divider/bgpaper سرمه‌ای می‌کنه،
            اون فایل رو هم بعدش هماهنگ می‌کنیم. */}
        <ProjectDetailsContent
          project={project}
          onClose={onClose}
          onSubmitProposal={onSubmitProposal}
          showClose={true}
        />

        {/* اگر خواستی یه فاصله/خط پایین بعد از محتوا: */}
        <Divider sx={{ mt: 2, borderColor: theme.palette.surface.border }} />
      </DialogContent>
    </Dialog>
  );
}
