import { createTheme } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", brand }) {
  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      background: {
        default: mode === "dark" ? "#0B0F14" : "#F6F7FB",
        paper:
          mode === "dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.9)",
      },
      text: {
        primary: mode === "dark" ? "#E8EDF3" : "#0B1220",
        secondary:
          mode === "dark" ? "rgba(232,237,243,0.7)" : "rgba(11,18,32,0.65)",
      },
    },
    shape: { borderRadius: 5 },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h4: { fontWeight: 800 },
      button: { fontWeight: 700, textTransform: "none" },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          },
        },
      },
    },
  });
}
