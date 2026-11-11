
import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../context/AuthContext";
import { changeProfileLocale } from "../../services/profile.service";

export default function LanguageSwitcher() {
    const { locale, changeLocale } = useLanguage();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const [isChanging, setIsChanging] = useState(false);

    const handleChange = async (_, newLocale) => {
        if (!newLocale || newLocale === locale || isChanging) {
            return;
        }

        const previousLocale = locale;

        setIsChanging(true);

        try {
            // Update the UI language first.
            await changeLocale(newLocale);

            // Persist the language for authenticated users.
            if (isAuthenticated) {
                await changeProfileLocale(newLocale);

                // Reload the profile to synchronize AuthContext.
                await queryClient.invalidateQueries({
                    queryKey: ["auth", "profile"],
                    exact: true,
                });
            }
        } catch (error) {
            // Restore the previous UI language if the API request fails.
            await changeLocale(previousLocale);

            console.error("Failed to update language:", error);
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <ToggleButtonGroup
            value={locale}
            exclusive
            onChange={handleChange}
            size="small"
            aria-label="Language selection"
            disabled={isChanging}
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
