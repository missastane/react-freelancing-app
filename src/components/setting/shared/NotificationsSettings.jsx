import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SettingsSectionHeader from "./SettingsSectionHeader";
import { useRole } from "../../../context/RoleContext";

function SectionCard({ title, subtitle, children, right }) {
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
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </Paper>
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

function Toggle({ checked, onChange, disabled }) {
  return (
    <Switch checked={checked} onChange={onChange} disabled={disabled} />
  );
}

export default function NotificationsSettings() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const { activeRole } = useRole();

  // Channels
  const [channels, setChannels] = React.useState({
    inApp: true,
    email: true,
    push: false,
  });

  // Quiet hours / DND
  const [quiet, setQuiet] = React.useState({
    enabled: false,
    start: "22:00",
    end: "08:00",
  });

  // Frequency
  const [digest, setDigest] = React.useState({
    enabled: false,
    cadence: "daily", // daily | weekly
  });

  // Categories (role-based)
  const baseCategories = [
    {
      key: "messages",
      title: "Messages",
      desc: "New messages and mentions.",
      defaultOn: true,
    },
    {
      key: "security",
      title: "Security alerts",
      desc: "New device sign-in, password or email changes.",
      defaultOn: true,
      lockedOn: true, // recommended always on
    },
    {
      key: "contracts",
      title: "Contracts",
      desc: "Contract changes, milestones, and delivery updates.",
      defaultOn: true,
    },
    {
      key: "payments",
      title: "Payments",
      desc: "Payouts, invoices, escrow releases, and payment status.",
      defaultOn: true,
    },
    {
      key: "system",
      title: "System updates",
      desc: "Important product updates and maintenance notices.",
      defaultOn: false,
    },
  ];

  const roleCategories =
    activeRole === "freelancer"
      ? [
          {
            key: "job_invites",
            title: "Invitations",
            desc: "Invites to apply to projects.",
            defaultOn: true,
          },
          {
            key: "new_matches",
            title: "New matches",
            desc: "New projects that match your skills and preferences.",
            defaultOn: true,
          },
          {
            key: "proposal_status",
            title: "Proposal updates",
            desc: "Your proposal is viewed, shortlisted, accepted, or rejected.",
            defaultOn: true,
          },
        ]
      : [
          {
            key: "new_proposals",
            title: "New proposals",
            desc: "A freelancer submits a proposal on your project.",
            defaultOn: true,
          },
          {
            key: "project_activity",
            title: "Project activity",
            desc: "Updates on your projects: status changes, approvals, delivery notes.",
            defaultOn: true,
          },
        ];

  const categories = React.useMemo(
    () => [...roleCategories, ...baseCategories],
    [activeRole]
  );

  const [prefs, setPrefs] = React.useState(() => {
    const init = {};
    categories.forEach((c) => {
      init[c.key] = Boolean(c.defaultOn);
    });
    return init;
  });

  // When role changes, reset only missing keys (keep user changes if any)
  React.useEffect(() => {
    setPrefs((prev) => {
      const next = { ...prev };
      categories.forEach((c) => {
        if (typeof next[c.key] === "undefined") next[c.key] = Boolean(c.defaultOn);
      });
      // Optionally clean removed keys:
      Object.keys(next).forEach((k) => {
        if (!categories.some((c) => c.key === k)) delete next[k];
      });
      return next;
    });
  }, [categories]);

  const setAll = (value) => {
    setPrefs((prev) => {
      const next = { ...prev };
      categories.forEach((c) => {
        next[c.key] = c.lockedOn ? true : value;
      });
      return next;
    });
  };

  const totalOn = Object.values(prefs).filter(Boolean).length;

  return (
    <Box>
      <SettingsSectionHeader
        title="Notifications"
        subtitle="Choose what we notify you about and how."
        right={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              size="small"
              label={`${totalOn} enabled`}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                backgroundColor: theme.palette.surface?.soft ?? "transparent",
              }}
            />
            <Button variant="outlined" onClick={() => setAll(true)}>
              Enable all
            </Button>
            <Button variant="outlined" onClick={() => setAll(false)}>
              Disable all
            </Button>
          </Stack>
        }
      />

      <Stack spacing={2}>
        {/* Channels */}
        <SectionCard
          title="Delivery channels"
          subtitle="Pick where you want to receive notifications."
        >
          <Stack spacing={1}>
            <Row
              title="In-app"
              desc="Show notifications inside the platform."
              action={
                <Toggle
                  checked={channels.inApp}
                  onChange={(e) =>
                    setChannels((s) => ({ ...s, inApp: e.target.checked }))
                  }
                />
              }
            />
            <Divider />
            <Row
              title="Email"
              desc="Receive notifications via email."
              action={
                <Toggle
                  checked={channels.email}
                  onChange={(e) =>
                    setChannels((s) => ({ ...s, email: e.target.checked }))
                  }
                />
              }
            />
            <Divider />
            <Row
              title="Push"
              desc="Browser/mobile push notifications (if supported)."
              action={
                <Toggle
                  checked={channels.push}
                  onChange={(e) =>
                    setChannels((s) => ({ ...s, push: e.target.checked }))
                  }
                />
              }
            />
          </Stack>
        </SectionCard>

        {/* Categories */}
        <SectionCard
          title="What you get notified about"
          subtitle={
            activeRole === "freelancer"
              ? "Freelancer-focused updates plus account-wide essentials."
              : "Employer-focused updates plus account-wide essentials."
          }
        >
          <Stack spacing={1}>
            {categories.map((c, idx) => {
              const locked = Boolean(c.lockedOn);
              const isChecked = Boolean(prefs[c.key]);

              return (
                <React.Fragment key={c.key}>
                  <Row
                    title={c.title}
                    desc={c.desc}
                    action={
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        {locked ? <Chip label="Recommended" size="small" /> : null}
                        <Toggle
                          checked={isChecked}
                          disabled={locked}
                          onChange={(e) =>
                            setPrefs((s) => ({ ...s, [c.key]: e.target.checked }))
                          }
                        />
                      </Stack>
                    }
                  />
                  {idx !== categories.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })}
          </Stack>
        </SectionCard>

        {/* Quiet Hours */}
        <SectionCard
          title="Quiet hours"
          subtitle="Pause non-critical notifications during certain hours."
          right={
            <FormControlLabel
              control={
                <Switch
                  checked={quiet.enabled}
                  onChange={(e) =>
                    setQuiet((s) => ({ ...s, enabled: e.target.checked }))
                  }
                />
              }
              label={quiet.enabled ? "On" : "Off"}
              sx={{ mr: 0 }}
            />
          }
        >
          <Stack spacing={1}>
            <Row
              title="Schedule"
              desc={
                quiet.enabled
                  ? `From ${quiet.start} to ${quiet.end} (local time)`
                  : "Enable quiet hours to configure a schedule."
              }
              disabled={!quiet.enabled}
              action={
                <Button variant="outlined" disabled={!quiet.enabled}>
                  Configure
                </Button>
              }
            />
            <Divider />
            <Row
              title="Always allow security alerts"
              desc="Critical security notifications are not muted."
              action={<Chip size="small" label="Always on" />}
            />
          </Stack>
        </SectionCard>

        {/* Digest */}
        <SectionCard
          title="Digest"
          subtitle="Get a summary instead of individual notifications (email)."
          right={
            <FormControlLabel
              control={
                <Switch
                  checked={digest.enabled}
                  onChange={(e) =>
                    setDigest((s) => ({ ...s, enabled: e.target.checked }))
                  }
                />
              }
              label={digest.enabled ? "On" : "Off"}
              sx={{ mr: 0 }}
            />
          }
        >
          <Stack spacing={1}>
            <Row
              title="Cadence"
              desc={digest.enabled ? `Send me a ${digest.cadence} summary.` : "Enable digest to choose cadence."}
              disabled={!digest.enabled}
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={digest.cadence === "daily" ? "contained" : "outlined"}
                    disabled={!digest.enabled}
                    onClick={() => setDigest((s) => ({ ...s, cadence: "daily" }))}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={digest.cadence === "weekly" ? "contained" : "outlined"}
                    disabled={!digest.enabled}
                    onClick={() => setDigest((s) => ({ ...s, cadence: "weekly" }))}
                  >
                    Weekly
                  </Button>
                </Stack>
              }
            />
            <Divider />
            <Row
              title="Email required"
              desc="Digest is delivered via email channel."
              action={
                <Chip
                  size="small"
                  label={channels.email ? "Email enabled" : "Email disabled"}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                    backgroundColor: theme.palette.surface?.soft ?? "transparent",
                  }}
                />
              }
            />
            {!channels.email ? (
              <Box
                sx={{
                  mt: 1.25,
                  p: 1.25,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                  backgroundColor: theme.palette.surface?.soft ?? "transparent",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Turn on <b>Email</b> in “Delivery channels” to use Digest.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </SectionCard>

        {/* Footer actions (UI only) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 1 }}
        >
          <Button variant="outlined">Reset</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>

        {/* Small hint */}
        <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
          Tip: security alerts are recommended to keep enabled.
        </Typography>
      </Stack>
    </Box>
  );
}