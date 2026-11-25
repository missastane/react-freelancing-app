import { Chip, Stack } from "@mui/material";
import SettingsSectionHeader from "../../shared/SettingsSectionHeader";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/AuthContext";

const SecuritySectionHeader = ({ riskyCount = 0 }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useAuth();

    const isTwoFactorEnabled = Boolean(user?.two_factor_enabled);

    return (
        <SettingsSectionHeader
            title={t("settings.security.title")}
            subtitle={t("settings.security.subtitle")}
            right={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    {riskyCount > 0 && (
                        <Chip
                            size="small"
                            color="warning"
                            label={t("settings.security.riskyCount", {
                                count: riskyCount,
                            })}
                        />
                    )}

                    <Chip
                        size="small"
                        label={
                            isTwoFactorEnabled
                                ? t("settings.security.two_factor.enabled")
                                : t("settings.security.two_factor.disabled")
                        }
                        sx={{
                            borderRadius: 2,
                            border: `1px solid ${
                                theme.palette.surface?.borderTint ??
                                theme.palette.divider
                            }`,
                            backgroundColor:
                                theme.palette.surface?.soft ?? "transparent",
                        }}
                    />
                </Stack>
            }
        />
    );
};

export default SecuritySectionHeader;