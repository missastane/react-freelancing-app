
import api from "../../api/axios";

const adminUserPrefix = "/admin/user/admin-user";

export const getAdminUsers = async (
    page = 1,
    perPage = 15,
    search = ""
) => {
    const response = await api.get(adminUserPrefix, {
        params: {
            page,
            per_page: perPage,
            ...(search && { search }),
        },
    });

    return response.data;
};

export const createAdminUser = async (data) => {
    const response = await api.post(`${adminUserPrefix}/store`, data);

    return response.data;
};

export const getAdminUser = async (adminId) => {
    const response = await api.get(
        `${adminUserPrefix}/show/${adminId}`
    );

    return response.data;
};