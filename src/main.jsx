
import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";

import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import "./i18n";

import { LanguageProvider } from "./context/LanguageProvider";
import { useLanguage } from "./hooks/useLanguage";

import {
    ThemeSettingsProvider,
    useThemeSettings,
} from "./theme/ThemeSettingsContext";

import { createEmotionCache } from "./theme/createEmotionCache";

import { Router } from "./app/Router";
import { RoleProvider } from "./context/RoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppSnackbar from "./components/common/AppSnackbar";
import GlobalNetworkAlert from "./components/common/GlobalNetworkAlert";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";

const queryClient = new QueryClient();

function AppRoot() {
    const { theme } = useThemeSettings();
    const { isRTL } = useLanguage();

    const direction = isRTL ? "rtl" : "ltr";

    const emotionCache = useMemo(
        () => createEmotionCache(direction),
        [direction]
    );

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={Router} />
                <GlobalNetworkAlert />
                <AppSnackbar />
            </ThemeProvider>
        </CacheProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <ThemeSettingsProvider>
                    <AuthProvider>
                        <RoleProvider>
                            <AppRoot />
                        </RoleProvider>
                    </AuthProvider>
                </ThemeSettingsProvider>
            </LanguageProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
