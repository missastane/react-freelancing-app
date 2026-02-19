import React from "react";
import { Card, CardActionArea, Stack, Typography, Box, Chip } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function KpiCard({ icon, label, value, hint, trend, href }) {
  const content = (
    <Stack spacing={1.2} sx={{ p: 2, flex: 1, width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box
          sx={(t) => ({
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
            background: t.palette.surface?.soft || t.palette.action.hover,
            flex: "0 0 auto",
          })}
        >
          {icon}
        </Box>

        {trend ? (
          <Chip size="small" label={`${trend.label} ${trend.value}`} />
        ) : (
          <ArrowForwardRoundedIcon fontSize="small" />
        )}
      </Stack>

      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>

      {hint && (
        <Typography variant="body2" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Card
      elevation={0}
      sx={(t) => ({
        width: "100%",          // ✅ مهم
        height: "100%",         // ✅ مهم
        display: "flex",        // ✅ مهم
        flexDirection: "column",// ✅ مهم

        borderRadius: 3,
        border: `1px solid ${t.palette.surface?.border || t.palette.divider}`,
        background: t.palette.surface?.strong || t.palette.background.paper,
        transition: "0.15s",
        "&:hover": {
          borderColor: t.palette.surface?.borderTint || t.palette.primary.main,
          transform: "translateY(-2px)",
        },
      })}
    >
      {href ? (
        <CardActionArea sx={{ width: "100%", height: "100%" }} href={href}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}
