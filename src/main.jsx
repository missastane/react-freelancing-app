import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { ThemeSettingsProvider, useThemeSettings } from "./theme/ThemeSettingsContext";
import { Router } from "./app/Router";

function AppRoot() {
  const { theme } = useThemeSettings();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeSettingsProvider>
      <AppRoot />
    </ThemeSettingsProvider>
  </React.StrictMode>
);
