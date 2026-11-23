import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import PersonalInfoCard from "./components/PersonalInfoCard";
import ContactInfoCard from "./components/ContactInfoCard";
import AboutMeCard from "./components/AboutMeCard";

export default function AccountOverview() {
    const { t } = useTranslation();

    return (
        <Box
            sx={(theme) => ({
                py: { xs: 3, sm: 4 },
                bgcolor:
                    theme.palette.surface?.soft ||
                    theme.palette.background.default,
                minHeight: "100vh",
            })}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <Stack spacing={0.8} sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, letterSpacing: -0.6 }}
                    >
                        {t("settings.account.overview.title")}
                    </Typography>

                    <Typography color="text.secondary">
                        {t("settings.account.overview.subtitle")}
                    </Typography>
                </Stack>

                <Stack spacing={3}>
                    <PersonalInfoCard />
                    <ContactInfoCard />
                    <AboutMeCard />
                </Stack>
            </Container>
        </Box>
    );
}