import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";


const DialogSectionCard = ({ title, icon, children, count }) => (
    <Card
        sx={{
            height: "100%",
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(255,255,255,0.82)",
            boxShadow: "0 8px 28px rgba(76, 81, 191, 0.06)",
            backdropFilter: "blur(10px)",
        }}
    >
        <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2.5 }}
            >
                <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            color: "primary.main",
                            bgcolor: "rgba(124, 93, 250, 0.10)",
                            "& .MuiSvgIcon-root": { fontSize: 21 },
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={800}>
                        {title}
                    </Typography>
                </Stack>

                {count !== undefined && (
                    <Chip
                        label={count}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                )}
            </Stack>

            {children}
        </CardContent>
    </Card>
);
export default DialogSectionCard;