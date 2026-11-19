import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminSkill } from "../../../services/admin/admin-skill.service";

export const useCreateAdminSkill = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "skills"],
            });
        },
    });
};