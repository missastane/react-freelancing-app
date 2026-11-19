import api from "../../api/axios";

const adminSkillPrefix = "/admin/market/skill";

export const getAdminSkills = async (page = 1, perPage = 15, search = "") => {
    const response = await api.get(adminSkillPrefix, {
        params: {
            page,
            per_page: perPage,
            search,
        },
    });

    return response.data;
};

export const createAdminSkill = async (data) => {
    const response = await api.post(`${adminSkillPrefix}/store`, data);
    return response.data;
};

export const getAdminSkill = async (skillId) => {
    const response = await api.get(
        `${adminSkillPrefix}/show/${skillId}`
    );

    return response.data;
};

export const updateAdminSkill = async ({ skillId, data }) => {
    const response = await api.put(
        `${adminSkillPrefix}/update/${skillId}`,
        data
    );

    return response.data;
};

export const deleteAdminSkill = async (skillId) => {
    const response = await api.delete(
        `${adminSkillPrefix}/delete/${skillId}`
    );

    return response.data;
};