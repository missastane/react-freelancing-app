import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../context/AuthContext";

export default function AboutMeCard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} mb={2}>
                    {t("settings.account.aboutMe.title")}
                </Typography>

                <Typography
                    variant="body1"
                    color={user?.about_me ? "text.primary" : "text.secondary"}
                    sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.9,
                    }}
                >
                    {user?.about_me ||
                        t("settings.account.aboutMe.empty")}
                </Typography>
            </CardContent>
        </Card>
    );
}