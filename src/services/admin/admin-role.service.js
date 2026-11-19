import api from "../../api/axios";

const adminRolePrefix = "/admin/user/role";

export const getAdminRoles = async (
    page = 1,
    perPage = 15,
    search = ""
) => {
    const response = await api.get(adminRolePrefix, {
        params: {
            page,
            per_page: perPage,
            search,
        },
    });

    return response.data;
};

export const createAdminRole = async (data) => {
    const response = await api.post(adminRolePrefix + "/store", data);
    return response.data;
};

export const getAdminRole = async (roleId) => {
    const response = await api.get(
        `${adminRolePrefix}/show/${roleId}`
    );

    return response.data;
};

export const updateAdminRole = async ({ roleId, data }) => {
    const response = await api.patch(
        `${adminRolePrefix}/update/${roleId}`,
        data
    );

    return response.data;
};

export const syncRolePermissions = async ({ roleId, permissions }) => {
    const response = await api.post(
        `${adminRolePrefix}/sync-permissions/${roleId}`,
        { permissions }
    );

    return response.data;
};

export const deleteAdminRole = async (roleId) => {
    const response = await api.delete(
        `${adminRolePrefix}/delete/${roleId}`
    );

    return response.data;
};