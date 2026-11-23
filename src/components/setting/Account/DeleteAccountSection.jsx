
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AccountSection from "./AccountSection";
import AccountRow from "./AccountRow";

export default function DeleteAccountSection() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        confirmText: "",
    });

    const surfaceHint = {
        borderRadius: 2,
        border: `1px solid ${
            theme.palette.surface?.borderTint ?? theme.palette.divider
        }`,
        backgroundColor: theme.palette.surface?.soft ?? "transparent",
        p: 1.25,
    };

    const canDelete =
        deleteDialog.confirmText.trim().toLowerCase() === "delete";

    const handleClose = () => {
        setDeleteDialog({
            open: false,
            confirmText: "",
        });
    };

    const confirmDelete = () => {
        if (!canDelete) return;

        handleClose();

        // UI-only: replace this with the account deletion request flow later.
        navigate("/dashboard");
    };

    return (
        <>
            <AccountSection
                title="Delete account"
                subtitle="Permanently delete your account and related data."
                right={<Chip size="small" label="Danger zone" />}
            >
                <Stack spacing={1}>
                    <AccountRow
                        title="Delete permanently"
                        desc="This action cannot be undone."
                        action={
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    setDeleteDialog({
                                        open: true,
                                        confirmText: "",
                                    })
                                }
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
            </AccountSection>

            <Dialog
                open={deleteDialog.open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Delete account permanently?
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={1.25} sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            This will permanently delete your account and
                            related data. This action cannot be undone.
                        </Typography>

                        <Box sx={surfaceHint}>
                            <Typography variant="body2" color="text.secondary">
                                Type <b>DELETE</b> to confirm.
                            </Typography>
                        </Box>

                        <TextField
                            value={deleteDialog.confirmText}
                            onChange={(event) =>
                                setDeleteDialog((previous) => ({
                                    ...previous,
                                    confirmText: event.target.value,
                                }))
                            }
                            placeholder="Type DELETE"
                            fullWidth
                            size="small"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button variant="outlined" onClick={handleClose}>
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
        </>
    );
}
