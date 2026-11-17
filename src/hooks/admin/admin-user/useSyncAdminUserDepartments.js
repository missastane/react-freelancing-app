import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncAdminUserDepartments } from "../../../services/admin/admin-user.service";

export const useSyncAdminUserDepartments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ adminId, departments }) =>
            syncAdminUserDepartments(adminId, departments),

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