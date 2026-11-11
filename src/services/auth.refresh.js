
import axios from "axios";
import {
    getAccessToken,
    setAccessToken,
} from "./auth.token";

const REFRESH_LOCK_NAME = "auth-refresh-lock";

const getCookie = (name) => {
    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${name}=`));

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(cookie.substring(name.length + 1));
};

// Perform the actual refresh request.
const performRefresh = async () => {
    const csrfToken = getCookie("XSRF-TOKEN");

    if (!csrfToken) {
        throw new Error("CSRF token cookie is missing.");
    }

    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        }
    );

    const accessToken = response.data?.data?.access_token;

    if (!accessToken) {
        throw new Error(
            "Refresh response does not contain an access token."
        );
    }

    // Store and broadcast the new token before releasing the lock.
    setAccessToken(accessToken);

    return response.data;
};

export const refreshToken = async () => {
    // Remember the token before waiting for the shared lock.
    const previousToken = getAccessToken();

    // Web Locks are not available in every browser.
    if (!navigator.locks?.request) {
        return performRefresh();
    }

    return navigator.locks.request(
        REFRESH_LOCK_NAME,
        { mode: "exclusive" },
        async () => {
            const currentToken = getAccessToken();

            // Another tab may have refreshed while this tab was waiting.
            if (currentToken && currentToken !== previousToken) {
                return {
                    data: {
                        access_token: currentToken,
                    },
                };
            }

            return performRefresh();
        }
    );
};
