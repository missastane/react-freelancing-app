
import { useTranslation } from "react-i18next";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BaseDialog from "../../../common/BaseDialog";
import SecurityHintBox from "../shared/SecurityHintBox";

export default function TwoFactorSetupDialog({
    open,
    onClose,
    step,
    secret,
    otp,
    recoveryCodes = [],
    onOtpChange,
    onNext,
    onBack,
    onConfirm,
    onFinish,
    onCopy,
    isLoading = false,
    error = null,
}) {
    const { t } = useTranslation();

    const stepTitles = {
        1: t("settings.security.two_factor.steps.authenticator"),
        2: t("settings.security.two_factor.steps.verify"),
        3: t("settings.security.two_factor.steps.recovery"),
    };

    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    const actions = (
        <>
            {step === 1 && (
                <>
                    <Button
                        color="inherit"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t("common.cancel")}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onNext}
                        disabled={isLoading}
                    >
                        {t("common.next")}
                    </Button>
                </>
            )}

            {step === 2 && (
                <>
                    <Button
                        color="inherit"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        {t("common.back")}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        disabled={isLoading || otp.trim().length !== 6}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : null
                        }
                    >
                        {isLoading
                            ? t("common.verifying")
                            : t("common.verify")}
                    </Button>
                </>
            )}

            {step === 3 && (
                <Button
                    variant="contained"
                    onClick={onFinish}
                >
                    {t("common.done")}
                </Button>
            )}
        </>
    );

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("settings.security.two_factor.setup.title")}
            subtitle={t("settings.security.two_factor.setup.subtitle")}
            icon={<ShieldIcon />}
            maxWidth="sm"
            showCloseButton
            closeButtonDisabled={isLoading}
            contentSx={{ pt: 2, pb: 3 }}
            actions={actions}
            actionsSx={{ px: 3, py: 2 }}
        >
            <Stack spacing={2.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                        label={t("settings.security.two_factor.setup.step", {
                            current: step,
                            total: 3,
                        })}
                    />

                    <Chip label={stepTitles[step]} />
                </Stack>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {step === 1 && (
                    <>
                        <Typography color="text.secondary">
                            {t("settings.security.two_factor.setup.scanInstructions")}
                        </Typography>

                        <Box
                            sx={{
                                borderRadius: 3,
                                border: "1px dashed",
                                borderColor: "divider",
                                bgcolor: "action.hover",
                                height: 220,
                                display: "grid",
                                placeItems: "center",
                            }}
                        >
                            <Typography color="text.secondary">
                                {t("settings.security.two_factor.setup.qrPlaceholder")}
                            </Typography>
                        </Box>

                        <SecurityHintBox>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    {t("settings.security.two_factor.setup.manualKey")}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <Chip label={secret || "—"} />

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ContentCopyIcon />}
                                        onClick={() => onCopy(secret)}
                                        disabled={!secret}
                                    >
                                        {t("common.copy")}
                                    </Button>
                                </Stack>
                            </Stack>
                        </SecurityHintBox>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Typography color="text.secondary">
                            {t("settings.security.two_factor.setup.verifyInstructions")}
                        </Typography>

                        <TextField
                            label={t("settings.security.two_factor.setup.verificationCode")}
                            value={otp}
                            onChange={(event) =>
                                onOtpChange(event.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="123456"
                            inputProps={{
                                inputMode: "numeric",
                                maxLength: 6,
                            }}
                            fullWidth
                            autoFocus
                        />

                        <SecurityHintBox>
                            <Typography variant="body2" color="text.secondary">
                                {t("settings.security.two_factor.setup.codeHint")}
                            </Typography>
                        </SecurityHintBox>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Typography color="text.secondary">
                            {t("settings.security.two_factor.setup.recoveryInstructions")}
                        </Typography>

                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                                p: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 1,
                                }}
                            >
                                {recoveryCodes.map((code) => (
                                    <Chip
                                        key={code}
                                        label={code}
                                        sx={{ justifyContent: "flex-start" }}
                                    />
                                ))}
                            </Box>

                            <Stack direction="row" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => onCopy(recoveryCodes.join("\n"))}
                                >
                                    {t("common.copy")}
                                </Button>
                            </Stack>
                        </Paper>

                        <SecurityHintBox>
                            <Alert severity="warning">
                                {t("settings.security.two_factor.setup.recoveryWarning")}
                            </Alert>
                        </SecurityHintBox>
                    </>
                )}
            </Stack>
        </BaseDialog>
    );
}
