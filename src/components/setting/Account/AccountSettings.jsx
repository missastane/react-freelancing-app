
import { Box, Chip, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useRole } from "../../../context/RoleContext";
import { useTranslation } from "react-i18next";

import SettingsSectionHeader from "../shared/SettingsSectionHeader";
import PersonalInformationSection from "./PersonalInformationSection";
import IdentitySection from "./IdentitySection";
import DeleteAccountSection from "./DeleteAccountSection";

export default function AccountSettings() {
    const theme = useTheme();
    const { activeRole } = useRole();
    const { t } = useTranslation();

    return (
        <Box>
            <SettingsSectionHeader
                title={t("settings.account.page.title")}
                subtitle={
                    activeRole === "freelancer"
                        ? t("settings.account.page.freelancerSubtitle")
                        : t("settings.account.page.employerSubtitle")
                }
                right={
                    <Chip
                        size="small"
                        label={
                            activeRole === "freelancer"
                                ? t("settings.account.page.freelancerView")
                                : t("settings.account.page.employerView")
                        }
                        sx={{
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.surface?.borderTint ??
                                theme.palette.divider
                                }`,
                            backgroundColor:
                                theme.palette.surface?.soft ?? "transparent",
                        }}
                    />
                }
            />

            <Stack spacing={2}>
                <PersonalInformationSection />

                <IdentitySection />

                <DeleteAccountSection />
            </Stack>
        </Box>
    );
}
