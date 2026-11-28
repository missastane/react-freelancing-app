import SecurityRow from "../shared/SecurityRow";
import SecuritySectionCard from "../shared/SecuritySectionCard";

import {
    Button,
    Chip,
    Divider,
    Stack,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import { useTranslation } from "react-i18next";

const PasswordSection = ({ onChangePassword }) => {
    const { t } = useTranslation();

    return (
        <SecuritySectionCard
            title={t("settings.security.password.title")}
            subtitle={t("settings.security.password.subtitle")}
            icon={<LockIcon fontSize="small" />}
        >
            <Stack spacing={1}>
                <SecurityRow
                    title={t("settings.security.password.changeTitle")}
                    desc={t("settings.security.password.changeDescription")}
                    action={
                        <Button
                            variant="contained"
                            onClick={onChangePassword}
                        >
                            {t("settings.security.password.changeButton")}
                        </Button>
                    }
                />

                <Divider />

                <SecurityRow
                    title={t("settings.security.password.resetTitle")}
                    desc={t("settings.security.password.resetDescription")}
                    action={
                        <Chip
                            size="small"
                            label={t("settings.security.password.available")}
                        />
                    }
                />
            </Stack>
        </SecuritySectionCard>
    );
};

export default PasswordSection;