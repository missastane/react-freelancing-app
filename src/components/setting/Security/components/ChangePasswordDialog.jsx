import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SecurityHintBox from "../shared/SecurityHintBox";

const ChangePasswordDialog = () => {
    const [pwd, setPwd] = React.useState({
        open: false,
        current: "",
        next: "",
        confirm: "",
        show: false,
    });

    const savePassword = () => {
        // UI-only validation
        if (!pwd.current.trim()) return;
        if (pwd.next.trim().length < 8) return;
        if (pwd.next !== pwd.confirm) return;

        setPwd({ open: false, current: "", next: "", confirm: "", show: false });
    };

    return (
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

                    <SecurityHintBox>
                        <Typography variant="body2" color="text.secondary">
                            Use at least 8 characters. Mix letters, numbers, and symbols.
                        </Typography>
                    </SecurityHintBox>

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

    )
}
export default ChangePasswordDialog