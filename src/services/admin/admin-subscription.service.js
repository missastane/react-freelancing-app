import api from "../../api/axios";

const adminSubscriptionPrefix = "/admin/market/subscription";

export const getAdminSubscriptions = async (
    page = 1,
    perPage = 15,
    search = ""
) => {
    const response = await api.get(adminSubscriptionPrefix, {
        params: {
            page,
            per_page: perPage,
            search,
        },
    });

    return response.data;
};

export const createAdminSubscription = async (data) => {
    const response = await api.post(
        `${adminSubscriptionPrefix}/store`,
        data
    );

    return response.data;
};

export const getAdminSubscription = async (subscriptionId) => {
    const response = await api.get(
        `${adminSubscriptionPrefix}/show/${subscriptionId}`
    );

    return response.data;
};

export const updateAdminSubscription = async (subscriptionId, data) => {
    const response = await api.put(
        `${adminSubscriptionPrefix}/update/${subscriptionId}`,
        data
    );

    return response.data;
};

export const deleteAdminSubscription = async (subscriptionId) => {
    const response = await api.delete(
        `${adminSubscriptionPrefix}/delete/${subscriptionId}`
    );

    return response.data;
};