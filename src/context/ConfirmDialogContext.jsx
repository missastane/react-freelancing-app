import React, {
    createContext,
    useCallback,
    useRef,
    useState,
} from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
    IconButton,
} from "@mui/material";

export const ConfirmDialogContext = createContext(null);

export default function ConfirmDialogProvider({ children }) {
    const [dialog, setDialog] = useState(null);
    const resolveRef = useRef(null);

    const confirm = useCallback((options = {}) => {
        if (resolveRef.current) {
            resolveRef.current(false);
        }

        setDialog({
            title: options.title || "Confirm action",
            message: options.message || "Are you sure?",
            confirmText: options.confirmText || "Confirm",
            cancelText: options.cancelText || "Cancel",
            confirmColor: options.confirmColor || "primary",
            icon: options.icon || null, // آیکن داینامیک (آیکن MUI یا SVG)
            description: options.description || "", // متن کوچک زیر پیام اصلی (مثل تصویر)
        });

        return new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleClose = useCallback((result) => {
        const resolve = resolveRef.current;
        resolveRef.current = null;
        setDialog(null);
        resolve?.(result);
    }, []);

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            <Dialog
                open={Boolean(dialog)}
                onClose={() => handleClose(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 } // گرد کردن لبه‌ها مطابق تصویر
                }}
            >
                {dialog && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
                            {dialog.icon && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 42,
                                        height: 42,
                                        borderRadius: "50%",
                                        border: "1.5px solid",
                                        borderColor: `${dialog.confirmColor}.main`,
                                        color: `${dialog.confirmColor}.main`,
                                        bgcolor: "transparent",
                                        flexShrink: 0,
                                    }}
                                >
                                    {React.cloneElement(dialog.icon, { fontSize: "small" })}
                                </Box>
                            )}
                            <Typography variant="h6" fontWeight="700" sx={{ color: 'text.primary' }}>
                                {dialog.title}
                            </Typography>
                        </DialogTitle>

                        <DialogContent>
                            <DialogContentText sx={{ color: 'text.primary', fontWeight: 500, fontSize: '1rem', mb: 0.5 }}>
                                {dialog.message}
                            </DialogContentText>
                            {dialog.description && (
                                <Typography variant="body2" color="text.secondary">
                                    {dialog.description}
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                onClick={() => handleClose(false)}
                                sx={{
                                    color: "text.secondary",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    px: 3,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1.5,
                                }}
                            >
                                {dialog.cancelText}
                            </Button>

                            <Button
                                onClick={() => handleClose(true)}
                                variant="contained"
                                disableElevation
                                color={dialog.confirmColor}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    borderRadius: 1.5,
                                }}
                            >
                                {dialog.confirmText}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </ConfirmDialogContext.Provider>
    );
}
