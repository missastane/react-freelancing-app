import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function ProfileLayout({ children }) {
  return (
    <Box sx={{ width: "100%", overflowX:"hidden" }}>
      <Stack spacing={0.8} sx={{ mb: 2.25 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
          Profile
        </Typography>
        <Typography color="text.secondary">
          Manage your public profile, visibility, and personal details.
        </Typography>
      </Stack>

      {children}
    </Box>
  );
}