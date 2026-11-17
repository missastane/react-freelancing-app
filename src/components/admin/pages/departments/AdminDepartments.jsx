
import { Paper, Typography } from "@mui/material";

export default function AdminDepartments() {
    return (
        <Paper sx={{ p: 3, border: 1, borderColor: "surface.border" }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Departments Management
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
                Departments management will be here.
            </Typography>
        </Paper>
    );
}
