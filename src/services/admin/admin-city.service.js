
import api from "../../api/axios";

const adminCityPrefix = "/admin/locale/city";

export const getAdminCities = async (
    provinceId,
    page = 1,
    perPage = 15,
    search = ""
) => {
    const response = await api.get(`${adminCityPrefix}/${provinceId}`, {
        params: {
            page,
            per_page: perPage,
            search,
        },
    });

    return response.data;
};


export const createAdminCity = async (provinceId, data) => {
    const response = await api.post(
        `${adminCityPrefix}/store/${provinceId}`,
        data
    );

    return response.data;
};


export const getAdminCity = async (cityId) => {
    const response = await api.get(`${adminCityPrefix}/show/${cityId}`);
    return response.data;
};

export const updateAdminCity = async (cityId, data) => {
    const response = await api.put(
        `${adminCityPrefix}/update/${cityId}`,
        data
    );

    return response.data;
};


export const deleteAdminCity = async (cityId) => {
    const response = await api.delete(
        `${adminCityPrefix}/delete/${cityId}`
    );

    return response.data;
};
