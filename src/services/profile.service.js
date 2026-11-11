import api from "../api/axios";

export const changeProfileLocale = async (locale) => {
    const response = await api.patch("/profile/change-locale", {
        locale,
    });

    return response.data;
};