import { useQuery } from "@tanstack/react-query";
import { getAdminSkill } from "../../../services/admin/admin-skill.service";

export const useAdminSkill = (skillId) => {
    return useQuery({
        queryKey: ["admin", "skills", skillId],
        queryFn: () => getAdminSkill(skillId),
        enabled: !!skillId,
    });
};