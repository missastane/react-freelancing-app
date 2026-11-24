import api from "../api/axios";

const profilePrefix = "/profile";

export const changeProfileLocale = async (locale) => {
    const response = await api.patch(`${profilePrefix}/change-locale`, {
        locale,
    });

    return response.data;
};

export const requestEmailChange = async (data) => {
    const response = await api.post(
        `${profilePrefix}/change-email`,
        data
    );

    return response.data;
};

export const requestMobileChange = async (mobile) => {
    const response = await api.patch(`${profilePrefix}/change-mobile`, {
        id: mobile,
    });

    return response.data;
};

export const confirmMobileChange = async ({ token, otp }) => {
    const response = await api.put(
        `${profilePrefix}/confirm-mobile/${encodeURIComponent(token)}`,
        { otp }
    );

    return response.data;
};


export const requestAccountDeletion = async (data) => {
    const response = await api.post(
        `${profilePrefix}/account-deletion-requests`,
        data
    );

    return response.data;
};

export const cancelAccountDeletion = async () => {
    const response = await api.patch(
        `${profilePrefix}/account-deletion-requests/cancel`
    );

    return response.data;
};
