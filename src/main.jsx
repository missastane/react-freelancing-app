import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { buildTheme, defaultThemeSettings } from "./theme";

function Root() {
  const [settings] = useState(defaultThemeSettings);

  const theme = useMemo(() => buildTheme(settings), [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
