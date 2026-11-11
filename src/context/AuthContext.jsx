
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";

import { useProfile } from "../hooks/auth/useProfile";
import {
    setAccessToken,
    getAccessToken,
    clearAccessToken,
    clearLocalAccessToken,
} from "../services/auth.token";
import { refreshToken } from "../services/auth.refresh";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => getAccessToken());
    const [isInitializing, setIsInitializing] = useState(true);
    const [loginMessage, setLoginMessage] = useState(null);
    const [shouldShowWelcomeMessage, setShouldShowWelcomeMessage] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);

    const queryClient = useQueryClient();

    // Prevent duplicate bootstrap refresh requests.
    const bootstrapAttemptedRef = useRef(false);

    const profileQuery = useProfile(Boolean(token));

    const isAuthenticated = Boolean(token);

    // Restore authentication when no access token exists.
    const restoreSession = useCallback(async () => {
        if (bootstrapAttemptedRef.current) {
            return;
        }

        bootstrapAttemptedRef.current = true;

        setIsInitializing(true);

        try {
            const response = await refreshToken();

            const accessToken = response?.data?.access_token;

            if (!accessToken) {
                throw new Error(
                    "Refresh response does not contain an access token."
                );
            }

            setToken(accessToken);
            setBootstrapError(null);

        } catch (error) {
            const status = error?.response?.status;

            const isInvalidSession =
                status === 401 ||
                status === 419 ||
                error?.message === "CSRF token cookie is missing.";

            if (isInvalidSession) {
                // The refresh session is no longer valid.
                clearAccessToken();
                setToken(null);
                setUser(null);
                setIsInitializing(false);
                setBootstrapError(null);

                return;
            }

            // Network errors and server errors should not invalidate the session.
            setBootstrapError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to restore your session. Please try again."
            );

            setIsInitializing(false);
        }
    }, []);

    // Restore authentication on application startup.
    useEffect(() => {
        if (!token) {
            restoreSession();
        }
    }, [token, restoreSession]);

    // Retry bootstrap authentication.
    const retryBootstrap = () => {
        bootstrapAttemptedRef.current = false;
        restoreSession();
    };

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
        setBootstrapError(null);
        setShouldShowWelcomeMessage(true);
        setIsInitializing(true);
    };

    // Handle profile request result.
    useEffect(() => {
        if (!token) {
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


        const handleSessionExpired = (event) => {
            queryClient.removeQueries({
                queryKey: ["auth", "profile"],
                exact: true,
            });

            // Do not broadcast again when the event came from another tab.
            clearLocalAccessToken();

            setToken(null);
            setUser(null);
            setLoginMessage(null);
            setIsInitializing(false);
            setShouldShowWelcomeMessage(false);
            setBootstrapError(null);
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
        setBootstrapError(null);
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

        bootstrapError,
        retryBootstrap,

        authError: token && profileQuery.isError
            ? profileQuery.error?.response?.data?.message ||
            "Unable to load your profile. Please try again."
            : null,

        retryProfile: profileQuery.refetch,
        isProfileFetching: profileQuery.isFetching,
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
