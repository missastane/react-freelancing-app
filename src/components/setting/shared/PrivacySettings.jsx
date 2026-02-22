import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
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

export default function PrivacySettings() {
  const theme = useTheme();
  const { activeRole } = useRole();

  // Shared toggles
  const [privacy, setPrivacy] = React.useState({
    showOnlineStatus: true,
    showLastSeen: false,
    allowSearchIndexing: true, // profile discoverability
    showReviews: true,
  });

  // Messaging permissions
  const [messaging, setMessaging] = React.useState({
    whoCanMessage: "authenticated", // everyone | authenticated | nobody
    allowAttachments: true,
  });

  // Freelancer extra controls (role-based)
  const [freelancerOnly, setFreelancerOnly] = React.useState({
    showHourlyRate: true,
    showAvailability: true,
    profileVisibility: "public", // public | platform | private
  });

  // Employer extra controls (optional, subtle)
  const [employerOnly, setEmployerOnly] = React.useState({
    showCompanyProfile: true,
  });

  const isFreelancer = activeRole === "freelancer";

  const surfaceBox = {
    borderRadius: 2,
    border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
    backgroundColor: theme.palette.surface?.soft ?? "transparent",
    p: 1.25,
  };

  return (
    <Box>
      <SettingsSectionHeader
        title="Privacy"
        subtitle="Control who can see your profile details and how people can reach you."
        right={
          <Chip
            size="small"
            label={isFreelancer ? "Freelancer view" : "Employer view"}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
              backgroundColor: theme.palette.surface?.soft ?? "transparent",
            }}
          />
        }
      />

      <Stack spacing={2}>
        {/* Profile visibility (role-based) */}
        <SectionCard
          title="Profile visibility"
          subtitle={
            isFreelancer
              ? "Decide who can view your freelancer profile."
              : "Control how your company profile appears."
          }
        >
          {isFreelancer ? (
            <Stack spacing={1}>
              <Row
                title="Visibility"
                desc="Public profiles can be shared via link. Platform-only limits visibility to logged-in users."
                action={
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="profile-visibility">Visibility</InputLabel>
                    <Select
                      labelId="profile-visibility"
                      label="Visibility"
                      value={freelancerOnly.profileVisibility}
                      onChange={(e) =>
                        setFreelancerOnly((s) => ({
                          ...s,
                          profileVisibility: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="platform">Platform users</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                }
              />

              <Divider />

              <Row
                title="Search & discovery"
                desc="Allow your profile to appear in platform search results."
                action={
                  <Switch
                    checked={privacy.allowSearchIndexing}
                    onChange={(e) =>
                      setPrivacy((s) => ({
                        ...s,
                        allowSearchIndexing: e.target.checked,
                      }))
                    }
                  />
                }
                disabled={freelancerOnly.profileVisibility === "private"}
              />

              {freelancerOnly.profileVisibility === "private" ? (
                <Box sx={surfaceBox}>
                  <Typography variant="body2" color="text.secondary">
                    Your profile is set to <b>Private</b>, so search & discovery is disabled.
                  </Typography>
                </Box>
              ) : null}
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Row
                title="Show company profile"
                desc="Show your company details on your public pages."
                action={
                  <Switch
                    checked={employerOnly.showCompanyProfile}
                    onChange={(e) =>
                      setEmployerOnly((s) => ({
                        ...s,
                        showCompanyProfile: e.target.checked,
                      }))
                    }
                  />
                }
              />
              <Divider />
              <Row
                title="Search & discovery"
                desc="Allow your profile to be discoverable within the platform."
                action={
                  <Switch
                    checked={privacy.allowSearchIndexing}
                    onChange={(e) =>
                      setPrivacy((s) => ({
                        ...s,
                        allowSearchIndexing: e.target.checked,
                      }))
                    }
                  />
                }
              />
            </Stack>
          )}
        </SectionCard>

        {/* Messaging permissions */}
        <SectionCard
          title="Messaging"
          subtitle="Control who can contact you and what they can send."
        >
          <Stack spacing={1}>
            <Row
              title="Who can message me?"
              desc="Limit who can start a conversation with you."
              action={
                <FormControl size="small" sx={{ minWidth: 240 }}>
                  <InputLabel id="who-can-message">Permission</InputLabel>
                  <Select
                    labelId="who-can-message"
                    label="Permission"
                    value={messaging.whoCanMessage}
                    onChange={(e) =>
                      setMessaging((s) => ({
                        ...s,
                        whoCanMessage: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="everyone">Everyone</MenuItem>
                    <MenuItem value="authenticated">Only logged-in users</MenuItem>
                    <MenuItem value="nobody">Nobody</MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider />

            <Row
              title="Allow attachments"
              desc="Allow images and files in messages."
              action={
                <Switch
                  checked={messaging.allowAttachments}
                  onChange={(e) =>
                    setMessaging((s) => ({
                      ...s,
                      allowAttachments: e.target.checked,
                    }))
                  }
                />
              }
              disabled={messaging.whoCanMessage === "nobody"}
            />

            {messaging.whoCanMessage === "nobody" ? (
              <Box sx={surfaceBox}>
                <Typography variant="body2" color="text.secondary">
                  Messaging is disabled. You won’t receive new conversations.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </SectionCard>

        {/* Presence */}
        <SectionCard
          title="Presence"
          subtitle="Choose what others can see about your activity."
        >
          <Stack spacing={1}>
            <Row
              title="Show online status"
              desc="Let others know when you’re online."
              action={
                <Switch
                  checked={privacy.showOnlineStatus}
                  onChange={(e) =>
                    setPrivacy((s) => ({
                      ...s,
                      showOnlineStatus: e.target.checked,
                      // If online status is off, last seen should also be off
                      showLastSeen: e.target.checked ? s.showLastSeen : false,
                    }))
                  }
                />
              }
            />

            <Divider />

            <Row
              title="Show last seen"
              desc="Show the last time you were active."
              action={
                <Switch
                  checked={privacy.showLastSeen}
                  onChange={(e) =>
                    setPrivacy((s) => ({ ...s, showLastSeen: e.target.checked }))
                  }
                  disabled={!privacy.showOnlineStatus}
                />
              }
              disabled={!privacy.showOnlineStatus}
            />

            {!privacy.showOnlineStatus ? (
              <Box sx={surfaceBox}>
                <Typography variant="body2" color="text.secondary">
                  “Last seen” requires “Online status” to be enabled.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </SectionCard>

        {/* What is shown */}
        <SectionCard
          title="Displayed information"
          subtitle="Control what parts of your profile are visible."
        >
          <Stack spacing={1}>
            {isFreelancer ? (
              <>
                <Row
                  title="Show hourly rate"
                  desc="Display your hourly rate on your public profile."
                  action={
                    <Switch
                      checked={freelancerOnly.showHourlyRate}
                      onChange={(e) =>
                        setFreelancerOnly((s) => ({
                          ...s,
                          showHourlyRate: e.target.checked,
                        }))
                      }
                      disabled={freelancerOnly.profileVisibility === "private"}
                    />
                  }
                  disabled={freelancerOnly.profileVisibility === "private"}
                />
                <Divider />
                <Row
                  title="Show availability"
                  desc="Show whether you’re available for new work."
                  action={
                    <Switch
                      checked={freelancerOnly.showAvailability}
                      onChange={(e) =>
                        setFreelancerOnly((s) => ({
                          ...s,
                          showAvailability: e.target.checked,
                        }))
                      }
                      disabled={freelancerOnly.profileVisibility === "private"}
                    />
                  }
                  disabled={freelancerOnly.profileVisibility === "private"}
                />
                <Divider />
                <Row
                  title="Show reviews"
                  desc="Show reviews and ratings on your profile."
                  action={
                    <Switch
                      checked={privacy.showReviews}
                      onChange={(e) =>
                        setPrivacy((s) => ({
                          ...s,
                          showReviews: e.target.checked,
                        }))
                      }
                      disabled={freelancerOnly.profileVisibility === "private"}
                    />
                  }
                  disabled={freelancerOnly.profileVisibility === "private"}
                />
              </>
            ) : (
              <>
                <Row
                  title="Show reviews"
                  desc="Show reviews and ratings on your profile."
                  action={
                    <Switch
                      checked={privacy.showReviews}
                      onChange={(e) =>
                        setPrivacy((s) => ({
                          ...s,
                          showReviews: e.target.checked,
                        }))
                      }
                    />
                  }
                />
                <Divider />
                <Row
                  title="Show company profile"
                  desc="Show company details to freelancers."
                  action={
                    <Switch
                      checked={employerOnly.showCompanyProfile}
                      onChange={(e) =>
                        setEmployerOnly((s) => ({
                          ...s,
                          showCompanyProfile: e.target.checked,
                        }))
                      }
                    />
                  }
                />
              </>
            )}

            {freelancerOnly.profileVisibility === "private" && isFreelancer ? (
              <Box sx={surfaceBox}>
                <Typography variant="body2" color="text.secondary">
                  Your profile is <b>Private</b>. Some display options are disabled.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </SectionCard>

        {/* Footer actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 1 }}
        >
          <Button variant="outlined">Reset</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
          Tip: restricting messaging can reduce spam, but may slow down new opportunities.
        </Typography>
      </Stack>
    </Box>
  );
}