import api from "../api/axios";

const authPrefix = "/auth";

export const login = async (credentials) => {
    const response = await api.post(`${authPrefix}/login`, credentials);
    return response.data;
};

export const register = async (credentials) => {
    const response = await api.post(`${authPrefix}/register`, credentials);
    return response.data;
};

export const resendVerificationEmail = async (email) => {
    const response = await api.post(
        `${authPrefix}/email/verification-notification`,
        { email }
    );

    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post(
        `${authPrefix}/forgot-password`,
        { email }
    );

    return response.data;
};

export const resetPassword = async (data) => {
    const response = await api.post(
        `${authPrefix}/reset-password`,
        data
    );

    return response.data;
};

export const logout = async () => {
    const response = await api.post(`${authPrefix}/logout`);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get(`/profile`);
    return response.data;
};