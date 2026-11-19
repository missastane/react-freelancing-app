import api from "../../api/axios";

const adminProvincePrefix = "/admin/locale/province";

export const getAdminProvinces = async (
    page = 1,
    perPage = 15,
    search = ""
) => {
    const response = await api.get(adminProvincePrefix, {
        params: {
            page,
            per_page: perPage,
            search,
        },
    });

    return response.data;
};

export const createAdminProvince = async (data) => {
    const response = await api.post(
        `${adminProvincePrefix}/store`,
        data
    );

    return response.data;
};


export const getAdminProvince = async (provinceId) => {
    const response = await api.get(
        `${adminProvincePrefix}/show/${provinceId}`
    );

    return response.data;
};

export const updateAdminProvince = async (provinceId, data) => {
    const response = await api.put(
        `${adminProvincePrefix}/update/${provinceId}`,
        data
    );

    return response.data;
};

export const deleteAdminProvince = async (provinceId) => {
    const response = await api.delete(
        `${adminProvincePrefix}/delete/${provinceId}`
    );

    return response.data;
};