
const TOKEN_KEY = "access_token";
const AUTH_CHANNEL_NAME = "auth_channel";

const authChannel =
    typeof window !== "undefined" &&
    typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(AUTH_CHANNEL_NAME)
        : null;

// Update the current tab without broadcasting.
const updateLocalToken = (token) => {
    if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.removeItem(TOKEN_KEY);
    }
};

// Listen for authentication changes from other tabs.
if (authChannel) {
    authChannel.addEventListener("message", (event) => {
        const { type, token } = event.data || {};

        if (type === "token-updated" && token) {
            updateLocalToken(token);

            window.dispatchEvent(
                new CustomEvent("auth:token-refreshed", {
                    detail: token,
                })
            );
        }

        if (type === "session-expired") {
            updateLocalToken(null);

            window.dispatchEvent(
                new CustomEvent("auth:session-expired", {
                    detail: { remote: true },
                })
            );
        }
    });
}

export const setAccessToken = (token) => {
    if (!token) {
        throw new Error("Access token cannot be empty.");
    }

    updateLocalToken(token);

    // Notify other tabs.
    authChannel?.postMessage({
        type: "token-updated",
        token,
    });
};

export const getAccessToken = () => {
    return sessionStorage.getItem(TOKEN_KEY);
};

// Clear only the current tab.
export const clearLocalAccessToken = () => {
    updateLocalToken(null);
};

// Clear the current tab and notify other tabs.
export const clearAccessToken = () => {
    clearLocalAccessToken();

    authChannel?.postMessage({
        type: "session-expired",
    });
};
