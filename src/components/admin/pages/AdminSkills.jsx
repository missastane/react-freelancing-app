import { Paper, Typography } from "@mui/material";

export default function AdminSkills() {
  return (
    <Paper sx={{ p: 3, border: 1, borderColor: "surface.border" }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Admin overview will be here.
      </Typography>
    </Paper>
  );
}