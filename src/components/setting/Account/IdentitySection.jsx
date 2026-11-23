
import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";

import AccountSection from "./AccountSection";
import AccountRow from "./AccountRow";
import EmailChangeDialog from "./EmailChangeDialog";
import MobileChangeDialog from "./MobileChangeDialog";

export default function IdentitySection() {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useAuth();

    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [mobileDialogOpen, setMobileDialogOpen] = useState(false);

    const email = user?.email ?? "";
    const emailVerified = Boolean(user?.email_verified_at);

    const phone = user?.mobile ?? "";
    const phoneVerified = Boolean(user?.mobile_verified_at);

    const surfaceHint = {
        borderRadius: 2,
        border: `1px solid ${
            theme.palette.surface?.borderTint ?? theme.palette.divider
        }`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
        p: 1.25,
    };

    const getVerificationChip = (verified) => (
        <Chip
            size="small"
            label={
                verified
                    ? t("settings.account.identity.verified")
                    : t("settings.account.identity.unverified")
            }
            sx={
                verified
                    ? undefined
                    : {
                        border: `1px solid ${
                            theme.palette.surface?.borderTint ??
                            theme.palette.divider
                        }`,
                        backgroundColor:
                            theme.palette.surface?.soft ?? "transparent",
                    }
            }
        />
    );

    return (
        <>
            <AccountSection
                title={t("settings.account.identity.title")}
                subtitle={t("settings.account.identity.subtitle")}
            >
                <Stack spacing={1}>
                    <AccountRow
                        title={t("settings.account.identity.email")}
                        desc={email}
                        action={
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "center" }}
                            >
                                {getVerificationChip(emailVerified)}

                                <Button
                                    variant="outlined"
                                    onClick={() => setEmailDialogOpen(true)}
                                >
                                    {t("common.edit")}
                                </Button>
                            </Stack>
                        }
                    />

                    <Divider />

                    <AccountRow
                        title={t("settings.account.identity.phone")}
                        desc={phone}
                        action={
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "center" }}
                            >
                                {getVerificationChip(phoneVerified)}

                                <Button
                                    variant="outlined"
                                    onClick={() => setMobileDialogOpen(true)}
                                >
                                    {t("common.edit")}
                                </Button>
                            </Stack>
                        }
                    />

                    {(!emailVerified || !phoneVerified) && (
                        <Box sx={{ ...surfaceHint, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t("settings.account.identity.unverifiedHint")}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </AccountSection>

            <EmailChangeDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
            />

            <MobileChangeDialog
                open={mobileDialogOpen}
                onClose={() => setMobileDialogOpen(false)}
            />
        </>
    );
}
