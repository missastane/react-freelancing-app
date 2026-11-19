import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminSkill } from "../../../services/admin/admin-skill.service";

export const useDeleteAdminSkill = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "skills"],
            });
        },
    });
};