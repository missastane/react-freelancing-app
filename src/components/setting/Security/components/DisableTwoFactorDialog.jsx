
import { useTranslation } from "react-i18next";
import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
} from "@mui/material";

import ShieldIcon from "@mui/icons-material/Shield";
import BaseDialog from "../../../common/BaseDialog";

export default function DisableTwoFactorDialog({
    open,
    onClose,
    password,
    code,
    onPasswordChange,
    onCodeChange,
    onSubmit,
    isLoading = false,
    error = null,
}) {
    const { t } = useTranslation();

    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    const actions = (
        <>
            <Button
                color="inherit"
                onClick={handleClose}
                disabled={isLoading}
            >
                {t("common.cancel")}
            </Button>

            <Button
                color="error"
                variant="contained"
                onClick={onSubmit}
                disabled={
                    isLoading ||
                    !password.trim() ||
                    !code.trim()
                }
                startIcon={
                    isLoading ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : null
                }
            >
                {isLoading
                    ? t("settings.security.two_factor.disabling")
                    : t("settings.security.two_factor.disable")}
            </Button>
        </>
    );

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("settings.security.two_factor.disableDialog.title")}
            subtitle={t("settings.security.two_factor.disableDialog.subtitle")}
            icon={<ShieldIcon />}
            maxWidth="sm"
            showCloseButton
            closeButtonDisabled={isLoading}
            contentSx={{ pt: 2, pb: 3 }}
            actions={actions}
            actionsSx={{ px: 3, py: 2 }}
        >
            <Stack spacing={2.5}>
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label={t("settings.security.two_factor.disableDialog.password")}
                    type="password"
                    value={password}
                    onChange={(event) =>
                        onPasswordChange(event.target.value)
                    }
                    fullWidth
                    autoComplete="current-password"
                    disabled={isLoading}
                />

                <TextField
                    label={t("settings.security.two_factor.disableDialog.code")}
                    value={code}
                    onChange={(event) =>
                        onCodeChange(event.target.value.trimStart())
                    }
                    placeholder="123456"
                    fullWidth
                    autoComplete="one-time-code"
                    disabled={isLoading}
                    helperText={t(
                        "settings.security.two_factor.disableDialog.codeHint"
                    )}
                />
            </Stack>
        </BaseDialog>
    );
}
