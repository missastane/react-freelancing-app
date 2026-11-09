
import React, { useCallback, useEffect, useMemo, useState } from "react";

import i18n from "../i18n";
import { LanguageContext } from "./LanguageContext";

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState(
        () => i18n.resolvedLanguage || i18n.language?.split("-")[0] || "en"
    );

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    }, [locale]);

    useEffect(() => {
        const handleLanguageChange = (language) => {
            setLocale(language.split("-")[0]);
        };

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, []);

    const changeLocale = useCallback(async (newLocale) => {
        if (!["en", "fa"].includes(newLocale)) {
            return;
        }

        await i18n.changeLanguage(newLocale);
    }, []);

    const value = useMemo(
        () => ({
            locale,
            changeLocale,
            isRTL: locale === "fa",
        }),
        [locale, changeLocale]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
