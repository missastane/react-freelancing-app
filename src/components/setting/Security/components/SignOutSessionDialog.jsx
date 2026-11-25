import * as React from "react";
import SecurityHintBox from "../shared/SecurityHintBox"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

const SignOutSessionDialog = () => {
    const [confirmSignout, setConfirmSignout] = React.useState({
        open: false,
        sessionId: null,
        all: false,
    });


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

    return (
        <Dialog open={confirmSignout.open} onClose={closeSignout} fullWidth maxWidth="xs">
            <DialogTitle>{confirmSignout.all ? "Sign out of all sessions?" : "Sign out of this session?"}</DialogTitle>
            <DialogContent>
                <Stack spacing={1.25} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {confirmSignout.all
                            ? "This will sign you out from all devices except the current one."
                            : "This will sign the selected device out of your account."}
                    </Typography>

                    <SecurityHintBox>
                        <Typography variant="body2" color="text.secondary">
                            If this was not you, change your password and enable 2FA.
                        </Typography>
                    </SecurityHintBox>
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
    )
}

export default SignOutSessionDialog