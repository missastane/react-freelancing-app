import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import {
    CheckCircle,
    ErrorOutline,
} from "@mui/icons-material";

const InfoItem = ({ label, value, icon, status }) => (
    <Box
        sx={{
            minWidth: 0,
            minHeight: 82,
            p: 2,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.58)",
            border: "1px solid rgba(148, 163, 184, 0.14)",
            transition: "background-color 180ms ease, transform 180ms ease",
            "&:hover": {
                bgcolor: "rgba(255,255,255,0.82)",
                transform: "translateY(-2px)",
            },
        }}
    >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            {icon && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "primary.main",
                        "& .MuiSvgIcon-root": { fontSize: 19 },
                    }}
                >
                    {icon}
                </Box>
            )}
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {label}
            </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            {status && (
                <Box
                    aria-label={status === "verified" ? "Verified" : "Not verified"}
                    sx={{
                        flex: "0 0 auto",
                        display: "flex",
                        color: status === "verified" ? "success.main" : "text.disabled",
                    }}
                >
                    {status === "verified" ? (
                        <CheckCircle sx={{ fontSize: 20 }} />
                    ) : (
                        <ErrorOutline sx={{ fontSize: 20 }} />
                    )}
                </Box>
            )}

            <Typography
                variant="body2"
                fontWeight={700}
                color="text.primary"
                sx={{ minWidth: 0, overflowWrap: "anywhere" }}
            >
                {value ?? "—"}
            </Typography>
        </Stack>
    </Box>
);
export default InfoItem;