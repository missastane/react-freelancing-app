
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
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => getAccessToken());
    const [isInitializing, setIsInitializing] = useState(true);
    const [loginMessage, setLoginMessage] = useState(null);
    const [shouldShowWelcomeMessage, setShouldShowWelcomeMessage] = useState(false);

    const profileQuery = useProfile(Boolean(token));

    const isAuthenticated = Boolean(token && user);

    const queryClient = useQueryClient();

    // Start authentication after receiving the access token.
    const startAuth = (accessToken) => {
        queryClient.removeQueries({
            queryKey: ["auth", "profile"],
            exact: true,
        });
        setAccessToken(accessToken);
        setToken(accessToken);
        setUser(null);
        setLoginMessage(null);
        setShouldShowWelcomeMessage(true);
        setIsInitializing(true);
    };

    // Handle profile request result.
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
            setIsInitializing(false);

            const status = profileQuery.error?.response?.status;

            // A 401 means the current session is no longer valid.
            if (status === 401) {
                queryClient.removeQueries({
                    queryKey: ["auth", "profile"],
                    exact: true,
                });
                clearAccessToken();
                setToken(null);
                setUser(null);
                setLoginMessage(null);
                setShouldShowWelcomeMessage(false);
            }

            // Network errors and server errors do not log out the user.
        }
    }, [
        token,
        shouldShowWelcomeMessage,
        profileQuery.isSuccess,
        profileQuery.isError,
        profileQuery.data,
        profileQuery.error,
    ]);

    // Listen for authentication events from Axios.
    useEffect(() => {
        const handleTokenRefreshed = (event) => {
            if (event.detail) {
                setToken(event.detail);
            }
        };

        const handleSessionExpired = () => {
            queryClient.removeQueries({
                queryKey: ["auth", "profile"],
                exact: true,
            });
            clearAccessToken();
            setToken(null);
            setUser(null);
            setLoginMessage(null);
            setIsInitializing(false);
            setShouldShowWelcomeMessage(false);
        };

        window.addEventListener(
            "auth:token-refreshed",
            handleTokenRefreshed
        );

        window.addEventListener(
            "auth:session-expired",
            handleSessionExpired
        );

        return () => {
            window.removeEventListener(
                "auth:token-refreshed",
                handleTokenRefreshed
            );

            window.removeEventListener(
                "auth:session-expired",
                handleSessionExpired
            );
        };
    }, []);

    const logout = () => {
        queryClient.removeQueries({
            queryKey: ["auth", "profile"],
            exact: true,
        });
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

        authError: token && profileQuery.isError
            ? profileQuery.error?.response?.data?.message ||
            "Unable to load your profile. Please try again."
            : null,

        retryProfile: profileQuery.refetch,
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
