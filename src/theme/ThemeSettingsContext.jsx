import React, { createContext, useContext, useMemo, useState } from "react";
import { buildTheme, defaultThemeSettings } from "./index";

const STORAGE_KEY = "app_theme_settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultThemeSettings;
    const parsed = JSON.parse(raw);
    return {
      ...defaultThemeSettings,
      ...parsed,
    };
  } catch {
    return defaultThemeSettings;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

const ThemeSettingsContext = createContext(null);

export function ThemeSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const theme = useMemo(() => buildTheme(settings), [settings]);

  const setMode = (mode) => {
    setSettings((prev) => {
      const next = { ...prev, mode };
      saveSettings(next);
      return next;
    });
  };

  const toggleMode = () => {
    setSettings((prev) => {
      const next = { ...prev, mode: prev.mode === "dark" ? "light" : "dark" };
      saveSettings(next);
      return next;
    });
  };

  const setPaletteKey = (paletteKey) => {
    setSettings((prev) => {
      const next = { ...prev, paletteKey };
      saveSettings(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ settings, theme, setMode, toggleMode, setPaletteKey }),
    [settings, theme]
  );

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx) throw new Error("useThemeSettings must be used within ThemeSettingsProvider");
  return ctx;
}
