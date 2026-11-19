import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminSkill } from "../../../services/admin/admin-skill.service";

export const useUpdateAdminSkill = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminSkill,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "skills"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "skills", variables.skillId],
            });
        },
    });
};