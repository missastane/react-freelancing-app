
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../services/auth.token";
import { refreshToken } from "../services/auth.refresh";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Shared promise to prevent multiple simultaneous refresh requests.
let refreshPromise = null;

// Attach access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("AXIOS ERROR DETAILS:", {
      name: error.name,
      message: error.message,
      code: error.code,
      isAxiosError: error.isAxiosError,
      response: error.response,
      request: error.request,
      config: error.config,
    });
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.error_code === "TOKEN_EXPIRED";

    // Only refresh when the access token has actually expired.
    if (!originalRequest || !isTokenExpired || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Start one refresh request and let concurrent requests share it.
      if (!refreshPromise) {
        refreshPromise = refreshToken()
          .then((response) => {
            const newToken = response?.data?.access_token;

            if (!newToken) {
              throw new Error("Refresh response does not contain an access token.");
            }

            setAccessToken(newToken);

            // Notify AuthContext about the updated token.
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
      clearAccessToken();

      // Notify AuthContext that the session is no longer valid.
      window.dispatchEvent(new Event("auth:session-expired"));

      return Promise.reject(refreshError);
    }
  }
);

export default api;
