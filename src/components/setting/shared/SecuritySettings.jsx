import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import ShieldIcon from "@mui/icons-material/Shield";
import SettingsSectionHeader from "./SettingsSectionHeader";

function SurfaceCard({ children }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: theme.palette.surface?.border ?? "divider",
        borderRadius: 3,
        backgroundImage: "none",
        overflow: "hidden",
      }}
    >
      {children}
    </Paper>
  );
}

function SectionCard({ title, subtitle, children, right, icon }) {
  return (
    <SurfaceCard>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            {icon ? (
              <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
            ) : null}
            <Box>
              <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </SurfaceCard>
  );
}

function Row({ title, desc, action, disabled }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        py: 1.5,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        {desc ? (
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ flexShrink: 0 }}>{action}</Box>
    </Stack>
  );
}

function HintBox({ children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
        p: 1.25,
      }}
    >
      {children}
    </Box>
  );
}

function maskCode(code) {
  if (!code) return "";
  const s = String(code);
  if (s.length <= 6) return "••••••";
  return s.slice(0, 2) + "•••••" + s.slice(-2);
}

export default function SecuritySettings() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

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

  // --- UI-only: Change password dialog
  const [pwd, setPwd] = React.useState({
    open: false,
    current: "",
    next: "",
    confirm: "",
    show: false,
  });

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

  const savePassword = () => {
    // UI-only validation
    if (!pwd.current.trim()) return;
    if (pwd.next.trim().length < 8) return;
    if (pwd.next !== pwd.confirm) return;

    setPwd({ open: false, current: "", next: "", confirm: "", show: false });
  };

  const sessionCount = sessions.length;
  const riskyCount = sessions.filter((s) => s.risky).length;

  return (
    <Box>
      <SettingsSectionHeader
        title="Security"
        subtitle="Protect your account with 2FA, session controls, and security alerts."
        right={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {riskyCount ? <Chip size="small" color="warning" label={`${riskyCount} risky`} /> : null}
            <Chip
              size="small"
              label={twoFA.enabled ? "2FA enabled" : "2FA disabled"}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                backgroundColor: theme.palette.surface?.soft ?? "transparent",
              }}
            />
          </Stack>
        }
      />

      <Stack spacing={2}>
        {/* 2FA */}
        <SectionCard
          title="Two-factor authentication (2FA)"
          subtitle="Require a verification code when signing in on a new device."
          icon={<ShieldIcon fontSize="small" />}
          right={
            <Switch
              checked={twoFA.enabled}
              onChange={(e) => {
                if (e.target.checked) open2FASetup();
                else disable2FA();
              }}
            />
          }
        >
          <Stack spacing={1}>
            <Row
              title={twoFA.enabled ? "2FA is enabled" : "2FA is disabled"}
              desc={
                twoFA.enabled
                  ? "Your account requires a verification code on new devices."
                  : "Enable 2FA to greatly reduce account takeover risk."
              }
              action={
                twoFA.enabled ? (
                  <Button variant="outlined" onClick={open2FASetup}>
                    Manage
                  </Button>
                ) : (
                  <Button variant="contained" onClick={open2FASetup}>
                    Enable 2FA
                  </Button>
                )
              }
            />

            {twoFA.enabled ? (
              <>
                <Divider />
                <Row
                  title="Recovery codes"
                  desc="Use these codes if you lose access to your authenticator."
                  action={
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Button variant="outlined" onClick={rotateRecoveryCodes} startIcon={<RefreshIcon />}>
                        Regenerate
                      </Button>
                      <Button variant="contained" onClick={() => copy(twoFA.recoveryCodes.join("\n"))}>
                        Copy
                      </Button>
                    </Stack>
                  }
                />
                <HintBox>
                  <Typography variant="body2" color="text.secondary">
                    Keep recovery codes somewhere safe. Anyone with them can access your account.
                  </Typography>
                </HintBox>
              </>
            ) : null}
          </Stack>
        </SectionCard>

        {/* Password */}
        <SectionCard
          title="Password"
          subtitle="Use a strong, unique password."
          icon={<LockIcon fontSize="small" />}
        >
          <Stack spacing={1}>
            <Row
              title="Change password"
              desc="Minimum 8 characters recommended."
              action={
                <Button variant="contained" onClick={() => setPwd((s) => ({ ...s, open: true }))}>
                  Change
                </Button>
              }
            />
            <Divider />
            <Row
              title="Password reset"
              desc="If you forgot your password, you can reset it from the login page."
              action={<Chip size="small" label="Available" />}
            />
          </Stack>
        </SectionCard>

        {/* Login alerts */}
        <SectionCard
          title="Login alerts"
          subtitle="Get notified when a new device signs in."
          icon={<ShieldIcon fontSize="small" />}
        >
          <Stack spacing={1}>
            <Row
              title="Email alerts"
              desc="We’ll email you about new device logins."
              action={
                <Switch
                  checked={prefs.loginAlertsEmail}
                  onChange={(e) => setPrefs((s) => ({ ...s, loginAlertsEmail: e.target.checked }))}
                />
              }
            />
            <Divider />
            <Row
              title="In-app alerts"
              desc="Show login alerts inside the platform."
              action={
                <Switch
                  checked={prefs.loginAlertsInApp}
                  onChange={(e) => setPrefs((s) => ({ ...s, loginAlertsInApp: e.target.checked }))}
                />
              }
            />
          </Stack>
        </SectionCard>

        {/* Active sessions */}
        <SectionCard
          title="Active sessions"
          subtitle="Review signed-in devices and sign out of others."
          icon={<DevicesIcon fontSize="small" />}
          right={
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Chip size="small" label={`${sessionCount} sessions`} />
              <Button variant="outlined" color="warning" onClick={openSignoutAll}>
                Sign out all
              </Button>
            </Stack>
          }
        >
          <HintBox>
            <Typography variant="body2" color="text.secondary">
              If you don’t recognize a session, sign out and change your password immediately.
            </Typography>
          </HintBox>

          <Box sx={{ height: 12 }} />

          <Paper
            variant="outlined"
            sx={{
              borderColor: theme.palette.surface?.border ?? "divider",
              borderRadius: 3,
              backgroundImage: "none",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table size={isMdUp ? "medium" : "small"}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Device</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Last active</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>IP</TableCell>
                    <TableCell sx={{ fontWeight: 900 }} align="right">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ minWidth: 200 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                          <Typography sx={{ fontWeight: 700 }}>{s.device}</Typography>
                          {s.current ? <Chip size="small" label="This device" /> : null}
                          {s.risky ? <Chip size="small" color="warning" label="Risky" /> : null}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Created: {s.createdAt}
                        </Typography>
                      </TableCell>

                      <TableCell>{s.location}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>{s.lastActive}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                          <Typography variant="body2">{s.ip}</Typography>
                          <Tooltip title="Copy IP">
                            <IconButton size="small" onClick={() => copy(s.ip)}>
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        {s.current ? (
                          <Button size="small" variant="text" disabled>
                            Active
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color={s.risky ? "warning" : "inherit"}
                            onClick={() => openSignoutOne(s.id)}
                          >
                            Sign out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </SectionCard>

        {/* Trusted devices */}
        <SectionCard
          title="Trusted devices"
          subtitle="Devices you chose to trust (skip frequent verification)."
          icon={<DevicesIcon fontSize="small" />}
          right={
            <Switch
              checked={prefs.rememberDevice30d}
              onChange={(e) => setPrefs((s) => ({ ...s, rememberDevice30d: e.target.checked }))}
            />
          }
        >
          <Stack spacing={1}>
            <Row
              title="Remember devices for 30 days"
              desc="Reduce 2FA prompts on trusted devices."
              action={<Chip size="small" label={prefs.rememberDevice30d ? "On" : "Off"} />}
            />

            <Divider />

            {trusted.length === 0 ? (
              <Typography color="text.secondary">No trusted devices yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {trusted.map((t, idx) => (
                  <React.Fragment key={t.id}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", py: 0.75 }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{t.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Added: {t.added} · Last used: {t.lastUsed}
                        </Typography>
                      </Box>
                      <Button variant="outlined" color="error" onClick={() => removeTrusted(t.id)}>
                        Remove
                      </Button>
                    </Stack>
                    {idx !== trusted.length - 1 ? <Divider /> : null}
                  </React.Fragment>
                ))}
              </Stack>
            )}

            <HintBox>
              <Typography variant="body2" color="text.secondary">
                Removing a trusted device may require 2FA again the next time you sign in from it.
              </Typography>
            </HintBox>
          </Stack>
        </SectionCard>

        {/* Footer actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 0.5 }}
        >
          <Button variant="outlined">Reset</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>
      </Stack>

      {/* 2FA Setup Wizard Dialog */}
      <Dialog open={twoFA.setupOpen} onClose={close2FASetup} fullWidth maxWidth="sm">
        <DialogTitle>Set up Two-factor authentication</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label={`Step ${twoFA.step} / 3`} />
              <Chip
                label={twoFA.step === 1 ? "Authenticator app" : twoFA.step === 2 ? "Verify code" : "Recovery codes"}
                sx={{
                  border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                  backgroundColor: theme.palette.surface?.soft ?? "transparent",
                }}
              />
            </Stack>

            {twoFA.step === 1 ? (
              <>
                <Typography color="text.secondary">
                  Install an authenticator app (Google Authenticator, Authy, 1Password, etc.) and scan this QR code.
                </Typography>

                {/* QR placeholder */}
                <Box
                  sx={{
                    borderRadius: 3,
                    border: `1px dashed ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                    backgroundColor: theme.palette.surface?.soft ?? "transparent",
                    height: 220,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Typography color="text.secondary">QR Code (placeholder)</Typography>
                </Box>

                <HintBox>
                  <Stack spacing={0.75}>
                    <Typography variant="body2" color="text.secondary">
                      Or enter this setup key manually:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip label={maskCode(twoFA.secret)} />
                      <Button variant="outlined" onClick={() => copy(twoFA.secret)}>
                        Copy key
                      </Button>
                    </Stack>
                  </Stack>
                </HintBox>

                <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                  <Button variant="contained" onClick={() => setTwoFA((s) => ({ ...s, step: 2 }))}>
                    Next
                  </Button>
                </Stack>
              </>
            ) : null}

            {twoFA.step === 2 ? (
              <>
                <Typography color="text.secondary">
                  Enter the 6-digit code from your authenticator app to verify.
                </Typography>

                <TextField
                  label="Verification code"
                  value={twoFA.otp}
                  onChange={(e) => setTwoFA((s) => ({ ...s, otp: e.target.value }))}
                  placeholder="123456"
                  size="small"
                  fullWidth
                  InputProps={{
                    inputMode: "numeric",
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShieldIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <HintBox>
                  <Typography variant="body2" color="text.secondary">
                    Codes change every 30 seconds. If it doesn’t work, check your device time settings.
                  </Typography>
                </HintBox>

                <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Button variant="outlined" onClick={() => setTwoFA((s) => ({ ...s, step: 1 }))}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTwoFA((s) => ({ ...s, step: 3 }))}
                    disabled={twoFA.otp.trim().length < 6}
                  >
                    Continue
                  </Button>
                </Stack>
              </>
            ) : null}

            {twoFA.step === 3 ? (
              <>
                <Typography color="text.secondary">
                  Save your recovery codes. You’ll need them if you lose access to your authenticator.
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.surface?.border ?? "divider",
                    borderRadius: 3,
                    backgroundImage: "none",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 1,
                    }}
                  >
                    {twoFA.recoveryCodes.map((c) => (
                      <Chip key={c} label={c} sx={{ justifyContent: "flex-start" }} />
                    ))}
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                    <Button variant="outlined" onClick={rotateRecoveryCodes} startIcon={<RefreshIcon />}>
                      Regenerate
                    </Button>
                    <Button variant="contained" onClick={() => copy(twoFA.recoveryCodes.join("\n"))}>
                      Copy
                    </Button>
                  </Stack>
                </Paper>

                <HintBox>
                  <Typography variant="body2" color="text.secondary">
                    Anyone with these codes can access your account. Store them securely.
                  </Typography>
                </HintBox>

                <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Button variant="outlined" onClick={() => setTwoFA((s) => ({ ...s, step: 2 }))}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={complete2FA}
                    disabled={twoFA.otp.trim().length < 6}
                  >
                    Finish setup
                  </Button>
                </Stack>
              </>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={close2FASetup}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change password dialog */}
      <Dialog open={pwd.open} onClose={() => setPwd((s) => ({ ...s, open: false }))} fullWidth maxWidth="xs">
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <TextField
              label="Current password"
              type="password"
              size="small"
              fullWidth
              value={pwd.current}
              onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))}
            />
            <TextField
              label="New password"
              type="password"
              size="small"
              fullWidth
              value={pwd.next}
              onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))}
            />
            <TextField
              label="Confirm new password"
              type="password"
              size="small"
              fullWidth
              value={pwd.confirm}
              onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))}
            />

            <HintBox>
              <Typography variant="body2" color="text.secondary">
                Use at least 8 characters. Mix letters, numbers, and symbols.
              </Typography>
            </HintBox>

            {pwd.next && pwd.next.length > 0 && pwd.next.length < 8 ? (
              <Typography variant="body2" color="warning.main">
                Password is too short (min 8 chars).
              </Typography>
            ) : null}

            {pwd.confirm && pwd.next !== pwd.confirm ? (
              <Typography variant="body2" color="warning.main">
                Passwords don’t match.
              </Typography>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => setPwd({ open: false, current: "", next: "", confirm: "", show: false })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={savePassword}
            disabled={!pwd.current.trim() || pwd.next.trim().length < 8 || pwd.next !== pwd.confirm}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sign out confirm dialog */}
      <Dialog open={confirmSignout.open} onClose={closeSignout} fullWidth maxWidth="xs">
        <DialogTitle>{confirmSignout.all ? "Sign out of all sessions?" : "Sign out of this session?"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {confirmSignout.all
                ? "This will sign you out from all devices except the current one."
                : "This will sign the selected device out of your account."}
            </Typography>

            <HintBox>
              <Typography variant="body2" color="text.secondary">
                If this was not you, change your password and enable 2FA.
              </Typography>
            </HintBox>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={closeSignout}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={doSignout}>
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}