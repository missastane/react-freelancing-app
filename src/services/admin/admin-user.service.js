
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

export const updateAdminUser = async (adminId, data) => {
    const response = await api.put(
        `${adminUserPrefix}/update/${adminId}`,
        data
    );

    return response.data;
};

export const toggleAdminUserActivation = async (adminId) => {
    const response = await api.patch(
        `${adminUserPrefix}/activation/${adminId}`
    );

    return response.data;
};

export const getAdminUserOptions = async () => {
    const response = await api.get(`${adminUserPrefix}/options`);
    return response.data;
};

export const syncAdminUserRoles = async (adminId, roles) => {
    const response = await api.post(
        `${adminUserPrefix}/roles/${adminId}/store`,
        { roles }
    );

    return response.data;
};

export const syncAdminUserPermissions = async (adminId, permissions) => {
    const response = await api.post(
        `${adminUserPrefix}/permissions/${adminId}/store`,
        { permissions }
    );

    return response.data;
};

export const syncAdminUserDepartments = async (adminId, departments) => {
    const response = await api.post(
        `${adminUserPrefix}/departments/${adminId}/store`,
        { departments }
    );

    return response.data;
};