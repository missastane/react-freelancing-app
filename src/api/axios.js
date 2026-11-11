
import axios from "axios";
import {
    getAccessToken,
    clearAccessToken,
} from "../services/auth.token";
import { refreshToken } from "../services/auth.refresh";
import {
    setNetworkError,
    clearNetworkError,
} from "../services/network.error";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Shared promise to prevent multiple simultaneous refresh requests
// within the same tab.
let refreshPromise = null;

// Determine whether the refresh session is definitely invalid.
const isInvalidRefreshSession = (error) => {
    const status = error?.response?.status;

    return (
        status === 401 ||
        status === 419 ||
        error?.message === "CSRF token cookie is missing."
    );
};

// Determine whether an error is likely temporary.
const isTemporaryNetworkError = (error) => {
    const status = error?.response?.status;

    return (
        !error?.response ||
        status >= 500
    );
};

// Notify AuthContext that the session has expired.
const notifySessionExpired = () => {
    clearAccessToken();
    clearNetworkError();

    window.dispatchEvent(
        new Event("auth:session-expired")
    );
};

// Attach access token to every outgoing request.
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired access tokens and temporary network errors.
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Ignore intentional request cancellation.
        if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
            return Promise.reject(error);
        }

        const isTokenExpired =
            error.response?.status === 401 &&
            error.response?.data?.error_code === "TOKEN_EXPIRED";

        // Only refresh when the access token has actually expired.
        if (
            originalRequest &&
            isTokenExpired &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Start one refresh request and let concurrent requests
                // within this tab share the same promise.
                if (!refreshPromise) {
                    refreshPromise = refreshToken()
                        .then((response) => {
                            const newToken = response?.data?.access_token;

                            if (!newToken) {
                                throw new Error(
                                    "Refresh response does not contain an access token."
                                );
                            }

                            // refreshToken() already stores and broadcasts
                            // the new token. Notify the current tab's AuthContext.
                            window.dispatchEvent(
                                new CustomEvent("auth:token-refreshed", {
                                    detail: newToken,
                                })
                            );

                            return newToken;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const newToken = await refreshPromise;

                // Retry the original request with the new access token.
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                if (isInvalidRefreshSession(refreshError)) {
                    notifySessionExpired();
                } else {
                    // Keep the current session and report a temporary error.
                    setNetworkError(refreshError);
                }

                return Promise.reject(refreshError);
            }
        }

        // Report connection errors and server errors globally.
        if (isTemporaryNetworkError(error)) {
            setNetworkError(error);
        }

        return Promise.reject(error);
    }
);

export default api;
