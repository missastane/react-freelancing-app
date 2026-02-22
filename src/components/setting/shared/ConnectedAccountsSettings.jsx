import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SettingsSectionHeader from "./SettingsSectionHeader";
import { useRole } from "../../../context/RoleContext";

function SurfaceCard({ children }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: theme.palette.surface?.border ?? "divider",
        borderRadius: 3,
        backgroundImage: "none",
      }}
    >
      {children}
    </Paper>
  );
}

function ProviderIcon({ name }) {
  // UI-only: simple monogram avatar-like icon (no external images)
  const theme = useTheme();
  const letter = (name || "?").trim().slice(0, 1).toUpperCase();

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        fontWeight: 900,
        border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
        userSelect: "none",
      }}
    >
      {letter}
    </Box>
  );
}

function AccountCard({
  provider,
  description,
  connected,
  email,
  onConnect,
  onDisconnect,
  recommended,
  dangerHint,
}) {
  const theme = useTheme();

  return (
    <SurfaceCard>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          <ProviderIcon name={provider} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 900 }}>{provider}</Typography>

                  {connected ? (
                    <Chip size="small" label="Connected" />
                  ) : (
                    <Chip
                      size="small"
                      label="Not connected"
                      sx={{
                        border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                        backgroundColor: theme.palette.surface?.soft ?? "transparent",
                      }}
                    />
                  )}

                  {recommended ? <Chip size="small" label="Recommended" /> : null}
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {description}
                </Typography>

                {connected && email ? (
                  <Typography variant="body2" sx={{ mt: 0.75 }}>
                    <span style={{ opacity: 0.75 }}>Signed in as:</span>{" "}
                    <b>{email}</b>
                  </Typography>
                ) : null}

                {dangerHint ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {dangerHint}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                {connected ? (
                  <Button color="error" variant="outlined" onClick={onDisconnect}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="contained" onClick={onConnect}>
                    Connect
                  </Button>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </SurfaceCard>
  );
}

export default function ConnectedAccountsSettings() {
  const theme = useTheme();
  const { activeRole } = useRole();

  // UI-only state
  const [accounts, setAccounts] = React.useState({
    google: { connected: true, email: "user@gmail.com" },
    github: { connected: false, email: "" },
    linkedin: { connected: false, email: "" },
  });

  const [confirm, setConfirm] = React.useState({
    open: false,
    providerKey: null,
  });

  const openDisconnect = (providerKey) => {
    setConfirm({ open: true, providerKey });
  };

  const closeDisconnect = () => {
    setConfirm({ open: false, providerKey: null });
  };

  const connect = (providerKey) => {
    // UI-only: fake connect + set sample email
    setAccounts((prev) => ({
      ...prev,
      [providerKey]: {
        connected: true,
        email:
          providerKey === "github"
            ? "user@github.com"
            : providerKey === "linkedin"
            ? "user@linkedin.com"
            : "user@gmail.com",
      },
    }));
  };

  const disconnect = () => {
    const key = confirm.providerKey;
    if (!key) return;

    setAccounts((prev) => ({
      ...prev,
      [key]: { connected: false, email: "" },
    }));
    closeDisconnect();
  };

  const connectedCount = Object.values(accounts).filter((a) => a.connected).length;
  const isFreelancer = activeRole === "freelancer";

  const mustKeepOneConnected = connectedCount <= 1;

  const providerMeta = [
    {
      key: "google",
      name: "Google",
      desc: "Use Google to sign in faster and secure your account.",
      recommended: true,
    },
    {
      key: "github",
      name: "GitHub",
      desc: isFreelancer
        ? "Link GitHub to showcase your work and streamline profile verification."
        : "Link GitHub if you collaborate with engineering teams.",
      recommended: isFreelancer,
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      desc: isFreelancer
        ? "Link LinkedIn to strengthen your professional identity."
        : "Link LinkedIn to support company credibility.",
      recommended: !isFreelancer,
    },
  ];

  const surfaceHint = {
    borderRadius: 2,
    border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
    backgroundColor: theme.palette.surface?.soft ?? "transparent",
    p: 1.25,
  };

  const disablingDisconnect =
    confirm.providerKey &&
    accounts[confirm.providerKey]?.connected &&
    mustKeepOneConnected;

  return (
    <Box>
      <SettingsSectionHeader
        title="Connected accounts"
        subtitle="Connect external accounts for faster sign-in and extra verification."
        right={
          <Chip
            size="small"
            label={`${connectedCount} connected`}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
              backgroundColor: theme.palette.surface?.soft ?? "transparent",
            }}
          />
        }
      />

      <Stack spacing={2}>
        {/* Top notice */}
        <Box sx={surfaceHint}>
          <Typography variant="body2" color="text.secondary">
            Connected accounts can be used for sign-in and identity verification. You can disconnect anytime,
            but it’s recommended to keep at least one sign-in method connected.
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {providerMeta.map((p) => {
            const state = accounts[p.key];
            const connected = Boolean(state?.connected);
            const email = state?.email || "";

            const dangerHint =
              connected && mustKeepOneConnected
                ? "You currently have only one connected sign-in method. Disconnecting it may lock you out unless you have another login method."
                : "";

            return (
              <AccountCard
                key={p.key}
                provider={p.name}
                description={p.desc}
                connected={connected}
                email={email}
                recommended={p.recommended}
                dangerHint={dangerHint}
                onConnect={() => connect(p.key)}
                onDisconnect={() => openDisconnect(p.key)}
              />
            );
          })}
        </Stack>

        {/* Footer actions (UI-only) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 0.5 }}
        >
          <Button variant="outlined">Reset</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>
      </Stack>

      {/* Disconnect confirm dialog */}
      <Dialog open={confirm.open} onClose={closeDisconnect} fullWidth maxWidth="xs">
        <DialogTitle>Disconnect account?</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Disconnecting will remove the link to this provider. You may not be able to sign in with it anymore.
            </Typography>

            {disablingDisconnect ? (
              <Box
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                  backgroundColor: theme.palette.surface?.soft ?? "transparent",
                  p: 1.25,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You have only <b>one</b> connected sign-in method. Consider connecting another provider first.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDisconnect} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={disconnect}
            color="error"
            variant="contained"
            disabled={disablingDisconnect}
          >
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}