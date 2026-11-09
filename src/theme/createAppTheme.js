
import { createTheme, alpha } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", brand, locale = "en" }) {
    const direction = locale === "fa" ? "rtl" : "ltr";

    const surfaceBorder =
        mode === "dark"
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.12)";

    const surfaceSoft =
        mode === "dark"
            ? "#141A23"
            : "#F9FAFB";

    const surfaceStrong =
        mode === "dark"
            ? "#1A2230"
            : "#FFFFFF";

    const borderTint = alpha(brand.primary, 0.35);

    return createTheme({
        direction,

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
                    mode === "dark"
                        ? "rgba(232,237,243,0.7)"
                        : "rgba(11,18,32,0.65)",
            },

            surface: {
                border: surfaceBorder,
                soft: surfaceSoft,
                strong: surfaceStrong,
                borderTint,
            },
        },

        shape: {
            borderRadius: 5,
        },

        typography: {
            fontFamily:
                locale === "fa"
                    ? "Vazirmatn, Roboto, Arial, sans-serif"
                    : "Roboto, Arial, sans-serif",

            h4: { fontWeight: 800 },
            button: {
                fontWeight: 700,
                textTransform: "none",
            },
        },

        components: {
            MuiCssBaseline: {
                styleOverrides: (theme) => ({
                    "input:-webkit-autofill": {
                        WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                            } inset`,
                        WebkitTextFillColor: theme.palette.text.primary,
                        caretColor: theme.palette.text.primary,
                        borderRadius: "inherit",
                    },
                    "input:-webkit-autofill:hover": {
                        WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                            } inset`,
                    },
                    "input:-webkit-autofill:focus": {
                        WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                            } inset`,
                    },
                }),
            },
            MuiPaper: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderColor: theme.palette.surface.border,
                        backdropFilter: "blur(14px)",
                    }),
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundColor:
                            theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF",
                        borderRadius: 12,
                        "& fieldset": { borderColor: theme.palette.surface.border },
                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1.5,
                        },
                    }),

                    input: ({ theme }) => ({
                        "&:-webkit-autofill": {
                            WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                                } inset !important`,
                            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                            caretColor: theme.palette.text.primary,
                            transition: "background-color 999999s ease-out",
                        },

                        "&:-webkit-autofill:hover": {
                            WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                                } inset !important`,
                        },

                        "&:-webkit-autofill:focus": {
                            WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === "dark" ? "#0F141B" : "#FFFFFF"
                                } inset !important`,
                        },
                    }),
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderColor: theme.palette.surface.border,
                    }),
                },
            },

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
}
