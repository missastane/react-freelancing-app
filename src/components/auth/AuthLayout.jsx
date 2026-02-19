import React from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
    
      sx={{
        minHeight: "100vh",
        width:"100%",
        overflow:"hidden",
        display: "grid",
        placeItems: "center",
        py: 4,
        bgcolor: "background.default",
        background:
          "radial-gradient(1000px 600px at 80% 10%, rgba(124,92,255,0.25), transparent 60%)," +
          "radial-gradient(900px 500px at 15% 85%, rgba(0,209,255,0.18), transparent 55%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0))",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            minHeight: { xs: "auto", md: 560 },
          }}
        >
          {/* Left Brand Panel */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRight: { xs: "none", md: "1px solid rgba(255,255,255,0.08)" },
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            }}
          >
            <Stack spacing={3} sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 900, letterSpacing: 0.4 }}>
                Freelance Platform
              </Typography>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>

              <Stack spacing={1.2} sx={{ mt: 2 }} color="text.secondary">
                <Typography>• Post jobs & hire faster</Typography>
                <Typography>• Proposals, chat, and file sharing</Typography>
                <Typography>• Build a standout freelancer profile</Typography>
              </Stack>

              <Box sx={{ mt: "auto", pt: 2, color: "text.secondary", fontSize: 13 }}>
                UI inspired by modern SaaS dashboards
              </Box>
            </Stack>
          </Box>

          {/* Right Form Panel */}
          <Box sx={{ p: { xs: 4, md: 6 }, display: "grid", alignItems: "center" }}>
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
