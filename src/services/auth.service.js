import api from "../api/axios";

const authPrefix = "/auth";

export const login = async (credentials) => {
    const response = await api.post(`${authPrefix}/login`, credentials);
    return response.data;
};

export const logout = async () => {
    const response = await api.post(`${authPrefix}/logout`);
    return response.data;
};

export const refreshToken = async () => {
    const response = await api.post(`${authPrefix}/refresh`);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get(`/profile`);
    return response.data;
};