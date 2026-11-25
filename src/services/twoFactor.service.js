
import api from "../api/axios";

const authPrefix = "/auth/two-factor";

export const startTwoFactorSetup = async () => {
    const response = await api.post(`${authPrefix}/setup`);
    return response.data;
};

export const confirmTwoFactorSetup = async (data) => {
    const response = await api.post(`${authPrefix}/confirm`, data);
    return response.data;
};

export const disableTwoFactor = async (data) => {
    const response = await api.post(`${authPrefix}/disable`, data);
    return response.data;
};
