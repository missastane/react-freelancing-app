import api from "../../api/axios";

const adminPermissionPrefix = "/admin/user/permission";

export const getAdminPermissions = async (page = 1, perPage = 15) => {
    const response = await api.get(adminPermissionPrefix, {
        params: {
            page,
            per_page: perPage,
        },
    });

    return response.data;
};

export const createAdminPermission = async (data) => {
    const response = await api.post(adminPermissionPrefix + "/store", data);
    return response.data;
};

export const getAdminPermission = async (permissionId) => {
    const response = await api.get(
        `${adminPermissionPrefix}/show/${permissionId}`
    );

    return response.data;
};

export const updateAdminPermission = async ({ permissionId, data }) => {
    const response = await api.patch(
        `${adminPermissionPrefix}/update/${permissionId}`,
        data
    );

    return response.data;
};

export const syncPermissionRoles = async ({ permissionId, roles }) => {
    const response = await api.post(
        `${adminPermissionPrefix}/sync-roles/${permissionId}`,
        { roles }
    );

    return response.data;
};

export const deleteAdminPermission = async (permissionId) => {
    const response = await api.delete(
        `${adminPermissionPrefix}/delete/${permissionId}`
    );

    return response.data;
};