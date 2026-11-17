
import { Paper, Typography } from "@mui/material";

export default function AdminPermissions() {
    return (
        <Paper sx={{ p: 3, border: 1, borderColor: "surface.border" }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Permissions Management
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
                Permissions management will be here.
            </Typography>
        </Paper>
    );
}
