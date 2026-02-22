import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function SettingsSectionHeader({ title, subtitle, right }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2 }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
    </Stack>
  );
}