import { createTheme } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", brand }) {
  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      background: {
        default: mode === "dark" ? "#0B0F14" : "#F6F7FB",
        paper: mode === "dark" ? "#121821" : "#FFFFFF",
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
          MuiOutlinedInput: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#0F141B"
                    : "#FFFFFF",
                borderRadius: 12,

                "& fieldset": {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.15)",
                },

                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },

                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1.5,
                },
              }),
            },
          },
          root: {
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          },
        },
      },
    },
  });
}
