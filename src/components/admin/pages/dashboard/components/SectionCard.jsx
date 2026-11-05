import { Paper, Stack, Typography, IconButton, Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function SectionCard({ title, subtitle, action, children, sx }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        border: 1,
        borderColor: "surface.border",
        borderRadius: 3,
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {action ?? (
          <IconButton size="small">
            <MoreHorizIcon />
          </IconButton>
        )}
      </Stack>

      {/* 👇 این قسمت باعث میشه محتوا همه کارت‌ها رو هم‌قد کنه */}
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}