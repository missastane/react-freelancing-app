import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function AdminTopbar() {
  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Toolbar
        sx={{
          borderBottom: 1,
          borderColor: "surface.border",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Admin Panel
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}