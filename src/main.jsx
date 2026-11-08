import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { ThemeSettingsProvider, useThemeSettings } from "./theme/ThemeSettingsContext";
import { Router } from "./app/Router";
import { RoleProvider } from "./context/RoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppSnackbar from "./components/common/AppSnackbar";

const queryClient = new QueryClient();
function AppRoot() {
  const { theme } = useThemeSettings();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Router} />
      <AppSnackbar />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeSettingsProvider>
        <AuthProvider>
          <RoleProvider>
            <AppRoot />
          </RoleProvider>
        </AuthProvider>
      </ThemeSettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);