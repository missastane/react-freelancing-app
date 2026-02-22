import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  Link,
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
        overflow: "hidden",
      }}
    >
      {children}
    </Paper>
  );
}

function SectionCard({ title, subtitle, children, right }) {
  return (
    <SurfaceCard>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Box>
            <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
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

export default function AccountSettings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { activeRole } = useRole();

  // UI-only: pretend data
  const [email, setEmail] = React.useState("user@example.com");
  const [phone, setPhone] = React.useState("+49 151 00000000");

  const [emailVerified, setEmailVerified] = React.useState(true);
  const [phoneVerified, setPhoneVerified] = React.useState(false);

  // UI-only forms state
  const [edit, setEdit] = React.useState({
    emailOpen: false,
    phoneOpen: false,
  });

  const [newEmail, setNewEmail] = React.useState(email);
  const [newPhone, setNewPhone] = React.useState(phone);

  // Data export (UI-only)
  const [exportRequested, setExportRequested] = React.useState(false);

  // Deactivate / Delete (UI-only)
  const [deactivate, setDeactivate] = React.useState({
    open: false,
    keepData: true,
  });

  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    confirmText: "",
  });

  const surfaceHint = {
    borderRadius: 2,
    border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
    backgroundColor: theme.palette.surface?.soft ?? "transparent",
    p: 1.25,
  };

  const openEmail = () => {
    setNewEmail(email);
    setEdit((s) => ({ ...s, emailOpen: true }));
  };
  const openPhone = () => {
    setNewPhone(phone);
    setEdit((s) => ({ ...s, phoneOpen: true }));
  };

  const saveEmail = () => {
    setEmail(newEmail.trim() || email);
    // UI-only: changing email typically requires re-verify
    setEmailVerified(false);
    setEdit((s) => ({ ...s, emailOpen: false }));
  };

  const savePhone = () => {
    setPhone(newPhone.trim() || phone);
    setPhoneVerified(false);
    setEdit((s) => ({ ...s, phoneOpen: false }));
  };

  const requestExport = () => {
    setExportRequested(true);
  };

  const confirmDeactivate = () => {
    setDeactivate((s) => ({ ...s, open: false }));
    // UI-only: navigate user somewhere safe
    navigate("/dashboard");
  };

  const canDelete = deleteDialog.confirmText.trim().toLowerCase() === "delete";

  const confirmDelete = () => {
    if (!canDelete) return;
    setDeleteDialog({ open: false, confirmText: "" });
    // UI-only: navigate
    navigate("/dashboard");
  };

  return (
    <Box>
      <SettingsSectionHeader
        title="Account"
        subtitle={
          activeRole === "freelancer"
            ? "Manage your login identity and account actions."
            : "Manage your account identity and access settings."
        }
        right={
          <Chip
            size="small"
            label={activeRole === "freelancer" ? "Freelancer view" : "Employer view"}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
              backgroundColor: theme.palette.surface?.soft ?? "transparent",
            }}
          />
        }
      />

      <Stack spacing={2}>
        {/* Identity */}
        <SectionCard
          title="Identity"
          subtitle="These details are used for login, recovery, and security alerts."
        >
          <Stack spacing={1}>
            <Row
              title="Email address"
              desc={email}
              action={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Chip size="small" label={emailVerified ? "Verified" : "Unverified"} />
                  <Button variant="outlined" onClick={openEmail}>
                    Edit
                  </Button>
                </Stack>
              }
            />
            <Divider />
            <Row
              title="Phone number"
              desc={phone}
              action={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Chip
                    size="small"
                    label={phoneVerified ? "Verified" : "Unverified"}
                    sx={
                      phoneVerified
                        ? undefined
                        : {
                            border: `1px solid ${theme.palette.surface?.borderTint ?? theme.palette.divider}`,
                            backgroundColor: theme.palette.surface?.soft ?? "transparent",
                          }
                    }
                  />
                  <Button variant="outlined" onClick={openPhone}>
                    Edit
                  </Button>
                </Stack>
              }
            />

            {!emailVerified || !phoneVerified ? (
              <Box sx={{ ...surfaceHint, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Unverified contact details can reduce account recovery options. Consider verifying them.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </SectionCard>

        {/* Password & Login */}
        <SectionCard
          title="Password & sign-in"
          subtitle="Keep your account safe with strong sign-in methods."
          right={
            <Link component={RouterLink} to="/settings/security" underline="hover">
              Go to Security
            </Link>
          }
        >
          <Stack spacing={1}>
            <Row
              title="Password"
              desc="Change your password regularly and avoid reusing it."
              action={
                <Button variant="contained" onClick={() => navigate("/settings/security")}>
                  Change password
                </Button>
              }
            />
            <Divider />
            <Row
              title="Re-authentication"
              desc="Some actions (like changing email or deleting account) may require re-authentication."
              action={<Chip size="small" label="Enabled" />}
            />
          </Stack>
        </SectionCard>

        {/* Data export */}
        <SectionCard
          title="Data & privacy"
          subtitle="Request a copy of your account data."
          right={
            exportRequested ? <Chip size="small" label="Requested" /> : null
          }
        >
          <Stack spacing={1}>
            <Row
              title="Download my data"
              desc={
                exportRequested
                  ? "Your export request is queued. You’ll receive an email when it’s ready."
                  : "We’ll prepare an export and send you a download link."
              }
              action={
                <Button
                  variant="outlined"
                  onClick={requestExport}
                  disabled={exportRequested}
                >
                  {exportRequested ? "Requested" : "Request export"}
                </Button>
              }
            />
          </Stack>
        </SectionCard>

        {/* Deactivate */}
        <SectionCard
          title="Deactivate account"
          subtitle="Temporarily disable your account and pause activity."
        >
          <Stack spacing={1}>
            <Row
              title="Deactivate"
              desc="You can reactivate later by signing in again."
              action={
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setDeactivate((s) => ({ ...s, open: true }))}
                >
                  Deactivate
                </Button>
              }
            />
          </Stack>
        </SectionCard>

        {/* Delete */}
        <SectionCard
          title="Delete account"
          subtitle="Permanently delete your account and related data."
          right={<Chip size="small" label="Danger zone" />}
        >
          <Stack spacing={1}>
            <Row
              title="Delete permanently"
              desc="This action cannot be undone."
              action={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteDialog({ open: true, confirmText: "" })}
                >
                  Delete account
                </Button>
              }
            />

            <Box sx={{ ...surfaceHint, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                If you’re unsure, consider <b>deactivating</b> instead.
              </Typography>
            </Box>
          </Stack>
        </SectionCard>

        {/* Footer */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 0.5 }}
        >
          <Button variant="outlined">Reset</Button>
          <Button variant="contained">Save changes</Button>
        </Stack>
      </Stack>

      {/* Edit Email Dialog */}
      <Dialog
        open={edit.emailOpen}
        onClose={() => setEdit((s) => ({ ...s, emailOpen: false }))}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit email</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <TextField
              label="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={surfaceHint}>
              <Typography variant="body2" color="text.secondary">
                Changing your email will require verification and may require re-authentication.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setEdit((s) => ({ ...s, emailOpen: false }))}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={saveEmail}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Phone Dialog */}
      <Dialog
        open={edit.phoneOpen}
        onClose={() => setEdit((s) => ({ ...s, phoneOpen: false }))}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit phone number</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <TextField
              label="Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={surfaceHint}>
              <Typography variant="body2" color="text.secondary">
                We may send a verification code to confirm your new phone number.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setEdit((s) => ({ ...s, phoneOpen: false }))}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={savePhone}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog
        open={deactivate.open}
        onClose={() => setDeactivate((s) => ({ ...s, open: false }))}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Deactivate account?</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Your profile will be hidden and you won’t receive new activity until you sign in again.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={deactivate.keepData}
                  onChange={(e) =>
                    setDeactivate((s) => ({ ...s, keepData: e.target.checked }))
                  }
                />
              }
              label="Keep my data for reactivation"
            />

            <Box sx={surfaceHint}>
              <Typography variant="body2" color="text.secondary">
                You can reactivate anytime by signing in.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setDeactivate((s) => ({ ...s, open: false }))}
          >
            Cancel
          </Button>
          <Button color="warning" variant="contained" onClick={confirmDeactivate}>
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, confirmText: "" })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete account permanently?</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              This will permanently delete your account and related data. This action cannot be undone.
            </Typography>

            <Box sx={surfaceHint}>
              <Typography variant="body2" color="text.secondary">
                Type <b>DELETE</b> to confirm.
              </Typography>
            </Box>

            <TextField
              value={deleteDialog.confirmText}
              onChange={(e) =>
                setDeleteDialog((s) => ({ ...s, confirmText: e.target.value }))
              }
              placeholder="Type DELETE"
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialog({ open: false, confirmText: "" })}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!canDelete}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}