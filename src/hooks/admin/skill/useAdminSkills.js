import { useQuery } from "@tanstack/react-query";
import { getAdminSkills } from "../../../services/admin/admin-skill.service";

export const useAdminSkills = ({ page, perPage, search }) => {
    return useQuery({
        queryKey: ["admin", "skills", { page, perPage, search }],
        queryFn: () => getAdminSkills(page, perPage, search),
        placeholderData: (previousData) => previousData,
    });
};