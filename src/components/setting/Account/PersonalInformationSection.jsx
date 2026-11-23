import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AccountSection from "./AccountSection";
import AccountRow from "./AccountRow";

export default function PersonalInformationSection() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <AccountSection
            title={t("settings.account.personalInformation.title")}
            subtitle={t("settings.account.personalInformation.subtitle")}
        >
            <AccountRow
                title={t("settings.account.personalInformation.overview")}
                desc={t("settings.account.personalInformation.description")}
                action={
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/settings/account/overview")}
                    >
                        {t("settings.account.personalInformation.viewDetails")}
                    </Button>
                }
            />
        </AccountSection>
    );
}