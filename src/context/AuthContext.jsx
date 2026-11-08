import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useProfile } from "../hooks/auth/useProfile";
import {
    setAccessToken,
    getAccessToken,
    clearAccessToken,
} from "../services/auth.token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => getAccessToken());
    const [isInitializing, setIsInitializing] = useState(true);
    const [loginMessage, setLoginMessage] = useState(null);
    const [shouldShowWelcomeMessage, setShouldShowWelcomeMessage] = useState(false);
    const profileQuery = useProfile(Boolean(token));

    const isAuthenticated = Boolean(token && user);

    // Start authentication after receiving the access token
    const startAuth = (accessToken) => {
        setAccessToken(accessToken);
        setToken(accessToken);
        setUser(null);
        setLoginMessage(null);
        setShouldShowWelcomeMessage(true);
        setIsInitializing(true);
    };

    // Handle profile request result
    useEffect(() => {
        if (!token) {
            setIsInitializing(false);
            return;
        }

        if (profileQuery.isSuccess) {
            setUser(profileQuery.data?.data ?? null);

            if (shouldShowWelcomeMessage) {
                setLoginMessage(profileQuery.data?.message ?? null);
                setShouldShowWelcomeMessage(false);
            }

            setIsInitializing(false);
        }

        if (profileQuery.isError) {
            clearAccessToken();
            setToken(null);
            setUser(null);
            setIsInitializing(false);
            setShouldShowWelcomeMessage(false);
        }
    }, [
        token,
        shouldShowWelcomeMessage,
        profileQuery.isSuccess,
        profileQuery.isError,
        profileQuery.data,
    ]);

    const logout = () => {
        clearAccessToken();
        setToken(null);
        setUser(null);
        setLoginMessage(null);
        setIsInitializing(false);
        setShouldShowWelcomeMessage(false);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        isInitializing,
        startAuth,
        logout,
        loginMessage,
        setLoginMessage,
        authError: profileQuery.isError
            ? profileQuery.error?.response?.data?.message ||
            "Unable to load your profile. Please try again."
            : null,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};