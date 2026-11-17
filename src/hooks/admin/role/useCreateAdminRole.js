import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminRole } from "../../../services/admin/admin-role.service";

export const useCreateAdminRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminRole,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "roles"],
            });
        },
    });
};