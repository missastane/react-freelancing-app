import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminRole } from "../../../services/admin/admin-role.service";

export const useUpdateAdminRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminRole,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "roles"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "roles", "detail", variables.roleId],
            });
        },
    });
};