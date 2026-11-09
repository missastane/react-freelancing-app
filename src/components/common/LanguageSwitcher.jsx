
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useLanguage } from "../../hooks/useLanguage";

export default function LanguageSwitcher() {
    const { locale, changeLocale } = useLanguage();

    const handleChange = (_, newLocale) => {
        if (newLocale) {
            changeLocale(newLocale);
        }
    };

    return (
        <ToggleButtonGroup
            value={locale}
            exclusive
            onChange={handleChange}
            size="small"
            aria-label="Language selection"
        >
            <ToggleButton value="en" aria-label="English">
                EN
            </ToggleButton>

            <ToggleButton value="fa" aria-label="Persian">
                فا
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
