import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../context/AuthContext";

function VerificationStatus({ verified, t }) {
    return (
        <Chip
            size="small"
            icon={
                verified ? (
                    <CheckCircleOutlineIcon />
                ) : (
                    <ErrorOutlineIcon />
                )
            }
            label={
                verified
                    ? t("settings.account.contactInfo.verified")
                    : t("settings.account.contactInfo.notVerified")
            }
            color={verified ? "success" : "warning"}
            variant="outlined"
        />
    );
}

export default function ContactInfoCard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    const contacts = [
        {
            label: t("settings.account.contactInfo.email"),
            value: user?.email,
            verified: Boolean(user?.email_verified_at),
            icon: <EmailOutlinedIcon />,
        },
        {
            label: t("settings.account.contactInfo.mobile"),
            value: user?.mobile,
            verified: Boolean(user?.mobile_verified_at),
            icon: <PhoneIphoneOutlinedIcon />,
        },
    ];

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} mb={3}>
                    {t("settings.account.contactInfo.title")}
                </Typography>

                <Grid container spacing={2.5}>
                    {contacts.map((contact) => (
                        <Grid key={contact.label} size={{ xs: 12, md: 6 }}>
                            <Stack spacing={1.2}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    color="text.secondary"
                                >
                                    {contact.icon}

                                    <Typography variant="body2">
                                        {contact.label}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body1"
                                    fontWeight={700}
                                >
                                    {contact.value || "-"}
                                </Typography>

                                <Box>
                                    <VerificationStatus
                                        verified={contact.verified}
                                        t={t}
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}