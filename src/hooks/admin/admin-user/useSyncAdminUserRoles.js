import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncAdminUserRoles } from "../../../services/admin/admin-user.service";

export const useSyncAdminUserRoles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ adminId, roles }) =>
            syncAdminUserRoles(adminId, roles),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "admin",
                    "users",
                    "detail",
                    variables.adminId,
                ],
            });
        },
    });
};