import React, { createContext, useCallback, useState } from "react";
import GlobalSnackbar from "../components/common/GlobalSnackbar";

export const NotificationContext = createContext(null);

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, severity = "success") => {
        if (!message) return;

        setNotification({
            id: Date.now(),
            message,
            severity,
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                hideNotification,
            }}
        >
            {children}

            <GlobalSnackbar
                notification={notification}
                onClose={hideNotification}
            />
        </NotificationContext.Provider>
    );
}