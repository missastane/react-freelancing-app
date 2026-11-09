import React from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
export default function AuthLayout({ title, subtitle, children }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
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
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.05fr 0.95fr",
            },
            minHeight: { xs: "auto", md: 560 },
          }}
        >
          {/* Brand Panel */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderInlineEnd: {
                xs: "none",
                md: "1px solid rgba(255,255,255,0.08)",
              },
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            }}
          >
            <Stack spacing={3} sx={{ height: "100%" }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  letterSpacing: 0.4,
                }}
              >
                {t("auth.layout.brand")}
              </Typography>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {title}
                </Typography>

                <Typography
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  {subtitle}
                </Typography>
              </Box>

              <Stack
                spacing={1.2}
                sx={{ mt: 2 }}
                color="text.secondary"
              >
                <Typography>
                  • {t("auth.layout.feature1")}
                </Typography>

                <Typography>
                  • {t("auth.layout.feature2")}
                </Typography>

                <Typography>
                  • {t("auth.layout.feature3")}
                </Typography>
              </Stack>

              <Box
                sx={{
                  mt: "auto",
                  pt: 2,
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                {t("auth.layout.footer")}
              </Box>
            </Stack>
          </Box>

          {/* Form Panel */}
          {/* Form Panel */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 3,
              }}
            >
              <LanguageSwitcher />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "grid",
                alignItems: "center",
              }}
            >
              {children}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}