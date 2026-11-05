import { Paper, Stack, Typography, Box } from "@mui/material";

export default function StatCard({ icon, label, value, helper, right }) {
  return (
    <Paper
      sx={{
        p: 2.25,
        border: 1,
        borderColor: "surface.border",
        borderRadius: 3,
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            bgcolor: "surface.soft",
            border: 1,
            borderColor: "surface.borderTint",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      {right ? <Box>{right}</Box> : null}
    </Paper>
  );
}