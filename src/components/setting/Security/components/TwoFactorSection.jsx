
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/AuthContext";

import {
  Alert,
  Button,
  Divider,
  Stack,
  Switch,
} from "@mui/material";

import ShieldIcon from "@mui/icons-material/Shield";

import {
  useStartTwoFactorSetup,
  useConfirmTwoFactorSetup,
  useDisableTwoFactor
} from "../../../../hooks/auth/useTwoFactor";
import { useNotification } from "../../../../hooks/useNotification";
import SecurityHintBox from "../shared/SecurityHintBox";
import SecurityRow from "../shared/SecurityRow";
import SecuritySectionCard from "../shared/SecuritySectionCard";
import TwoFactorSetupDialog from "./TwoFactorSetupDialog";
import DisableTwoFactorDialog from "./DisableTwoFactorDialog";

const TwoFactorSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isEnabled = Boolean(user?.two_factor_enabled);

  const [setupOpen, setSetupOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [secret, setSecret] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [recoveryCodes, setRecoveryCodes] = React.useState([]);
  const [setupError, setSetupError] = React.useState("");
  const [disableOpen, setDisableOpen] = React.useState(false);
  const [disablePassword, setDisablePassword] = React.useState("");
  const [disableCode, setDisableCode] = React.useState("");
  const [disableError, setDisableError] = React.useState("");

  const { showNotification } = useNotification();
  const startSetupMutation = useStartTwoFactorSetup();
  const confirmSetupMutation = useConfirmTwoFactorSetup();
  const disableMutation = useDisableTwoFactor();

  const isLoading =
    startSetupMutation.isPending ||
    confirmSetupMutation.isPending ||
    disableMutation.isPending;

  const open2FASetup = () => {
    setStep(1);
    setSecret("");
    setOtp("");
    setRecoveryCodes([]);
    setSetupError("");

    startSetupMutation.mutate(undefined, {
      onSuccess: (response) => {
        setSecret(response.data.secret);
        setSetupOpen(true);
      },
      onError: (error) => {
        setSetupError(
          error.response?.data?.message ||
          t("settings.security.two_factor.setup.startError")
        );
      },
    });
  };

  const close2FASetup = () => {
    if (isLoading) return;

    setSetupOpen(false);
    setStep(1);
    setSecret("");
    setOtp("");
    setRecoveryCodes([]);
    setSetupError("");

    startSetupMutation.reset();
    confirmSetupMutation.reset();
  };

  const openDisableDialog = () => {
    setDisablePassword("");
    setDisableCode("");
    setDisableError("");
    setDisableOpen(true);
  };

  const closeDisableDialog = () => {
    if (disableMutation.isPending) return;

    setDisableOpen(false);
    setDisablePassword("");
    setDisableCode("");
    setDisableError("");
    disableMutation.reset();
  };

  const handleDisable = () => {
    setDisableError("");

    disableMutation.mutate(
      {
        password: disablePassword,
        code: disableCode,
      },
      {
        onSuccess: (response) => {
          setDisableOpen(false);
          setDisablePassword("");
          setDisableCode("");
          setDisableError("");
          disableMutation.reset();

          showNotification(response.message, "success");
        },
        onError: (error) => {
          setDisableError(
            error.response?.data?.message ||
            t("settings.security.two_factor.disableError")
          );
          showNotification(
            error?.response?.data?.message || t("common.generalError"),
            "error"
          );
        },
      }
    );
  };

  const handleCopy = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleNext = () => {
    setStep(2);
    setSetupError("");
  };

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1));
    setSetupError("");
  };

  const handleConfirm = () => {
    setSetupError("");

    confirmSetupMutation.mutate(
      { code: otp },
      {
        onSuccess: (response) => {
          setRecoveryCodes(response.data.recovery_codes || []);
          setStep(3);
          setOtp("");

          showNotification(response.message, "success");
        },
        onError: (error) => {
          setSetupError(
            error.response?.data?.message ||
            t("settings.security.two_factor.setup.confirmError")
          );
          showNotification(
            error?.response?.data?.message || t("common.generalError"),
            "error"
          );
        },
      }
    );
  };

  const handleFinish = () => {
    close2FASetup();
  };

  return (
    <>
      <SecuritySectionCard
        title={t("settings.security.two_factor.title")}
        subtitle={t("settings.security.two_factor.subtitle")}
        icon={<ShieldIcon fontSize="small" />}
        right={
          <Switch
            checked={isEnabled}
            onChange={(event) => {
              if (event.target.checked) {
                open2FASetup();
              }
            }}
            disabled={isEnabled || isLoading}
            inputProps={{
              "aria-label": t(
                "settings.security.two_factor.title"
              ),
            }}
          />
        }
      >
        <Stack spacing={1}>
          {setupError && !setupOpen && (
            <Alert severity="error">
              {setupError}
            </Alert>
          )}

          <SecurityRow
            title={
              isEnabled
                ? t("settings.security.two_factor.enabled")
                : t("settings.security.two_factor.disabled")
            }
            desc={
              isEnabled
                ? t(
                  "settings.security.two_factor.enabledDescription"
                )
                : t(
                  "settings.security.two_factor.disabledDescription"
                )
            }
            action={
              isEnabled ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={openDisableDialog}
                  disabled={isLoading}
                >
                  {t("settings.security.two_factor.disable")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={open2FASetup}
                  disabled={isLoading}
                >
                  {t("settings.security.two_factor.enable")}
                </Button>
              )
            }
          />

          {isEnabled && (
            <>
              <Divider />

              <SecurityHintBox>
                {t(
                  "settings.security.two_factor.recoveryCodesHint"
                )}
              </SecurityHintBox>
            </>
          )}
        </Stack>
      </SecuritySectionCard>

      <TwoFactorSetupDialog
        open={setupOpen}
        onClose={close2FASetup}
        step={step}
        secret={secret}
        otp={otp}
        recoveryCodes={recoveryCodes}
        onOtpChange={setOtp}
        onNext={handleNext}
        onBack={handleBack}
        onConfirm={handleConfirm}
        onFinish={handleFinish}
        onCopy={handleCopy}
        isLoading={isLoading}
        error={setupError}
      />

      <DisableTwoFactorDialog
        open={disableOpen}
        onClose={closeDisableDialog}
        password={disablePassword}
        code={disableCode}
        onPasswordChange={setDisablePassword}
        onCodeChange={setDisableCode}
        onSubmit={handleDisable}
        isLoading={disableMutation.isPending}
        error={disableError}
      />
    </>
  );
};

export default TwoFactorSection;
