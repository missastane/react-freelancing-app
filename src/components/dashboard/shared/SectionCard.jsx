import React from "react";
import { Paper, Stack, Typography, Box } from "@mui/material";

export default function SectionCard({ title, action, children, sx }) {
  return (
    <Paper
      variant="outlined"
      sx={[
        (t) => ({
          width: "100%",           // ✅ مهم
          maxWidth: "none",        // ✅ مهم
          height: "100%",          // ✅ مهم
          display: "flex",         // ✅ مهم
          flexDirection: "column", // ✅ مهم

          borderRadius: 3,
          borderColor: t.palette.surface?.border || t.palette.divider,
          bgcolor: t.palette.surface?.soft || t.palette.background.paper,
          backgroundImage: "none",
          overflow: "hidden",
        }),
        sx, // ✅ sx که از بیرون میاد حتماً اعمال بشه
      ]}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.25, pt: 2, pb: 1.25 }}
      >
        <Typography sx={{ fontWeight: 900 }} variant="h6">
          {title}
        </Typography>

        {action ? <Box sx={{ flex: "0 0 auto" }}>{action}</Box> : null}
      </Stack>

      <Box sx={{ px: 2.25, pb: 2.25, flex: 1, minHeight: 0 }}>
        {children}
      </Box>
    </Paper>
  );
}
