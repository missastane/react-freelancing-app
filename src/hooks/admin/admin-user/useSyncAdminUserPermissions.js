
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncAdminUserPermissions } from "../../../services/admin/admin-user.service";

export const useSyncAdminUserPermissions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ adminId, permissions }) =>
            syncAdminUserPermissions(adminId, permissions),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "users", "detail", variables.adminId],
            });
        },
    });
};
