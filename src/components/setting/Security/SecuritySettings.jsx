import * as React from "react";
import {
  Box,
  Button,
  Stack,
} from "@mui/material";
import TwoFactorSection from "./components/TwoFactorSection";
import TwoFactorSetupDialog from "./components/TwoFactorSetupDialog";
import PasswordSection from "./components/PasswordSection";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import LoginAlertsSection from "./components/LoginAlertsSection";
import ActiveSessionsSection from "./components/ActiveSessionsSection";
import SignOutSessionDialog from "./components/SignOutSessionDialog";
import TrustedDevicesSection from "./components/TrustedDevicesSection";
import SecuritySectionHeader from "./components/SecuritySectionHeader";

export default function SecuritySettings() {

  // --- UI-only: Security preferences
  const [prefs, setPrefs] = React.useState({
    loginAlertsEmail: true,
    loginAlertsInApp: true,
    rememberDevice30d: true,
  });

  // --- UI-only: 2FA state
  const [twoFA, setTwoFA] = React.useState({
    enabled: false,
    setupOpen: false,
    step: 1, // 1: app, 2: code, 3: recovery
    secret: "JBSWY3DPEHPK3PXP",
    otp: "",
    recoveryCodes: [
      "9D3K-1H7P",
      "Q8X2-LM4Z",
      "N1FA-7K2Q",
      "6P0T-X9VC",
      "R5A1-3G8M",
      "Z7N2-4W1H",
      "2Q9L-8C0P",
      "H3K7-5D2N",
    ],
  });

  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

  // --- UI-only: sessions & trusted devices
  const [sessions, setSessions] = React.useState([
    {
      id: "sess_1",
      current: true,
      device: "Chrome · Windows",
      location: "Berlin, DE",
      ip: "185.44.12.10",
      lastActive: "Just now",
      createdAt: "2026-02-22 10:15",
    },
    {
      id: "sess_2",
      current: false,
      device: "Safari · iPhone",
      location: "Berlin, DE",
      ip: "91.20.7.3",
      lastActive: "2 hours ago",
      createdAt: "2026-02-21 20:05",
    },
    {
      id: "sess_3",
      current: false,
      device: "Unknown device",
      location: "—",
      ip: "203.0.113.9",
      lastActive: "3 days ago",
      createdAt: "2026-02-19 09:01",
      risky: true,
    },
  ]);

  const [trusted, setTrusted] = React.useState([
    { id: "td_1", name: "Chrome on Windows", added: "2026-02-10", lastUsed: "Today" },
    { id: "td_2", name: "Safari on iPhone", added: "2026-02-12", lastUsed: "Yesterday" },
  ]);

  // --- UI-only dialogs for signout
  const [confirmSignout, setConfirmSignout] = React.useState({
    open: false,
    sessionId: null,
    all: false,
  });

  // Helpers
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore (UI-only)
    }
  };

  const open2FASetup = () => {
    setTwoFA((s) => ({ ...s, setupOpen: true, step: 1, otp: "" }));
  };

  const close2FASetup = () => {
    setTwoFA((s) => ({ ...s, setupOpen: false, step: 1, otp: "" }));
  };

  const complete2FA = () => {
    // UI-only: verify OTP by simple length check
    if (twoFA.otp.trim().length < 6) return;
    setTwoFA((s) => ({ ...s, enabled: true, setupOpen: false, step: 1, otp: "" }));
  };

  const disable2FA = () => {
    setTwoFA((s) => ({ ...s, enabled: false }));
  };

  const rotateRecoveryCodes = () => {
    // UI-only
    setTwoFA((s) => ({
      ...s,
      recoveryCodes: s.recoveryCodes
        .map((c) => c.split("").reverse().join(""))
        .slice(0, 8),
    }));
  };

  const openSignoutOne = (sessionId) => {
    setConfirmSignout({ open: true, sessionId, all: false });
  };

  const openSignoutAll = () => {
    setConfirmSignout({ open: true, sessionId: null, all: true });
  };

  const closeSignout = () => {
    setConfirmSignout({ open: false, sessionId: null, all: false });
  };

  const doSignout = () => {
    if (confirmSignout.all) {
      // UI-only: keep current session only
      setSessions((prev) => prev.filter((s) => s.current));
    } else if (confirmSignout.sessionId) {
      setSessions((prev) => prev.filter((s) => s.id !== confirmSignout.sessionId));
    }
    closeSignout();
  };

  const removeTrusted = (id) => setTrusted((prev) => prev.filter((t) => t.id !== id));

  const sessionCount = sessions.length;

  return (
    <Box>
      <SecuritySectionHeader />

      <Stack spacing={2}>
        {/* 2FA */}
        <TwoFactorSection
          twoFA={twoFA}
          onOpenSetup={open2FASetup}
          onDisable={disable2FA}
          onRotateRecoveryCodes={rotateRecoveryCodes}
          onCopy={copy}
        />

        {/* Password */}
        <PasswordSection
          onChangePassword={() => setChangePasswordOpen(true)}
        />

        {/* Login alerts */}
        <LoginAlertsSection
          prefs={prefs}
          setPrefs={setPrefs}
        />

        {/* Active sessions */}
        <ActiveSessionsSection
          sessions={sessions}
          sessionCount={sessionCount}
          onCopy={copy}
          onSignoutOne={openSignoutOne}
          onSignoutAll={openSignoutAll}
        />

        {/* Trusted devices */}
        <TrustedDevicesSection
          prefs={prefs}
          setPrefs={setPrefs}
          trusted={trusted}
          onRemove={removeTrusted}
        />

      </Stack>

      {/* 2FA Setup Wizard Dialog */}
      <TwoFactorSetupDialog
        twoFA={twoFA}
        setTwoFA={setTwoFA}
        onComplete={complete2FA}
        onClose={close2FASetup}
        onCopy={copy}
      />

      {/* Change password dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {/* Sign out confirm dialog */}
      <SignOutSessionDialog
        confirmSignout={confirmSignout}
        onClose={closeSignout}
        onConfirm={doSignout}
      />
    </Box>
  );
}