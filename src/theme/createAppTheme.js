import { createTheme, alpha } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", brand }) {
  // base borders depending on mode
  const surfaceBorder =
    mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";

  // surface tints derived from brand (palette)
 const surfaceSoft =
  mode === "dark"
     ? "#141A23" : "#F9FAFB";

const surfaceStrong =
  mode === "dark"
   ? "#1A2230" : "#FFFFFF";

const borderTint = alpha(brand.primary, 0.35) // فقط برای accent

  // const borderTint = alpha(brand.primary, mode === "dark" ? 0.45 : 0.35);

  const theme = createTheme({
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
        secondary: mode === "dark" ? "rgba(232,237,243,0.7)" : "rgba(11,18,32,0.65)",
      },

      // ✅ Surface tokens (use these everywhere in UI)
      surface: {
        border: surfaceBorder,
        soft: surfaceSoft,
        strong: surfaceStrong,
        borderTint,
      },
    },

    shape: { borderRadius: 5 },

    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h4: { fontWeight: 800 },
      button: { fontWeight: 700, textTransform: "none" },
    },

    components: {
      // ✅ Default Paper look (cards, panels, etc.)
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            // border only makes sense when variant="outlined" (or if you force it)
            // but having a default helps keep cards consistent
            borderColor: theme.palette.surface.border,
            backdropFilter: "blur(14px)",
          }),
        },
      },

      // ✅ OutlinedInput override (TextField variant="outlined")
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF",
            borderRadius: 12,

            "& fieldset": {
              borderColor: theme.palette.surface.border,
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

      // ✅ Optional: chips a bit nicer in dark mode
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.surface.border,
          }),
        },
      },

      // ✅ Optional: buttons look a bit more premium
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.surface.border,
            "&:hover": {
              borderColor: theme.palette.surface.borderTint,
            },
          }),
        },
      },
    },
  });

  return theme;
}
