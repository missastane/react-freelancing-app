import { Box } from "@mui/material";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "background.paper",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        Sidebar
      </Box>

      {/* Main Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <Box
          sx={{
            height: 70,
            px: 3,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Header
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {children}
        </Box>

      </Box>
    </Box>
  );
}
