import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../context/AuthContext";
import { formatLocalizedDate } from "../../../../../utils/date";

export default function PersonalInfoCard() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    const fullName = [user?.first_name, user?.last_name]
        .filter(Boolean)
        .join(" ");


    const genderLabels = {
        male: t("settings.account.personalInfo.gender.male"),
        female: t("settings.account.personalInfo.gender.female"),
    };

    const fields = [
        {
            label: t("settings.account.personalInfo.username"),
            value: user?.username,
        },
        {
            label: t("settings.account.personalInfo.firstName"),
            value: user?.first_name,
        },
        {
            label: t("settings.account.personalInfo.lastName"),
            value: user?.last_name,
        },
        {
            label: t("settings.account.personalInfo.nationalCode"),
            value: user?.national_code
                ? `${user.national_code.slice(0, 3)}******`
                : null,
        },
        {
            label: t("settings.account.personalInfo.gender.label"),
            value: genderLabels[user?.gender_type] || user?.gender_type,
        },
        {
            label: t("settings.account.personalInfo.birthDate"),
            value: formatLocalizedDate(
                user?.birth_date,
                i18n.language
            ),
        },
    ];

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                >
                    <Typography variant="h6" fontWeight={800}>
                        {t("settings.account.personalInfo.title")}
                    </Typography>
                </Stack>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    spacing={2}
                    mb={3}
                >
                    <Avatar
                        src={user?.avatar_photo || undefined}
                        alt={
                            fullName ||
                            user?.username ||
                            t("settings.account.personalInfo.user")
                        }
                        sx={{ width: 76, height: 76 }}
                    >
                        <PersonOutlineIcon fontSize="large" />
                    </Avatar>

                    <Box textAlign={{ xs: "center", sm: "left" }}>
                        <Typography variant="h6" fontWeight={700}>
                            {fullName ||
                                user?.username ||
                                t("settings.account.personalInfo.user")}
                        </Typography>

                        <Typography color="text.secondary" variant="body2">
                            @{user?.username || "-"}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2.5}>
                    {fields.map((field) => (
                        <Grid key={field.label} size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={0.5}
                            >
                                {field.label}
                            </Typography>

                            <Typography variant="body1" fontWeight={600}>
                                {field.value || "-"}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}