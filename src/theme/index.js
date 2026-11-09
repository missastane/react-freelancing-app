import { palettes } from "./palettes";
import { createAppTheme } from "./createAppTheme";

export const defaultThemeSettings = {
    mode: "dark",
    paletteKey: "violet",
};

export function buildTheme(settings, locale = "en") {
    const brand = palettes[settings.paletteKey] || palettes.violet;

    return createAppTheme({
        mode: settings.mode,
        brand,
        locale,
    });
}