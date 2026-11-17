
import {
    AppBar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function BaseDialog({
    open,
    onClose,
    title,
    subtitle,
    icon,
    children,
    actions,
    headerActions,

    maxWidth = "sm",
    fullWidth = true,
    fullScreen = false,

    headerVariant = "standard",

    paperSx = {},
    titleSx = {},
    contentSx = { py: 3 },
    actionsSx = {},
    headerSx = {},
    iconColor = "primary",

    showDivider = true,
    showCloseButton = false,
    closeButtonDisabled = false,
}) {
    const theme = useTheme();

    const renderStandardHeader = () => (
        <>
            {(title || subtitle || icon) && (
                <>
                    <DialogTitle
                        sx={{
                            pb: 2,
                            ...titleSx,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ minWidth: 0, flex: 1 }}
                            >
                                {icon && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2,
                                            bgcolor: `${iconColor}.light`,
                                            color: `${iconColor}.dark`,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                )}

                                <Box sx={{ minWidth: 0 }}>
                                    {title && (
                                        <Typography variant="h6" fontWeight={700}>
                                            {title}
                                        </Typography>
                                    )}

                                    {subtitle && (
                                        <Typography variant="body2" color="text.secondary">
                                            {subtitle}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                {headerActions}

                                {showCloseButton && (
                                    <IconButton
                                        onClick={onClose}
                                        disabled={closeButtonDisabled}
                                        aria-label="Close"
                                        color="inherit"
                                    >
                                        <CloseRoundedIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        </Stack>
                    </DialogTitle>

                    {showDivider && <Divider />}
                </>
            )}
        </>
    );

    const renderAppBarHeader = () => (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: theme.palette.surface.strong,
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: theme.palette.surface.border,
                backgroundImage: "none",
                ...headerSx,
            }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    {title && (
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 900 }}
                            noWrap
                        >
                            {title}
                        </Typography>
                    )}

                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {headerActions}

                {showCloseButton && (
                    <IconButton
                        onClick={onClose}
                        disabled={closeButtonDisabled}
                        aria-label="Close"
                        color="inherit"
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 3,
                    p: fullScreen ? 0 : 1,
                    ...paperSx,
                },
            }}
        >
            {headerVariant === "appBar"
                ? renderAppBarHeader()
                : renderStandardHeader()}

            <DialogContent sx={contentSx}>
                {children}
            </DialogContent>

            {actions && (
                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                        gap: 1,
                        ...actionsSx,
                    }}
                >
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
}
