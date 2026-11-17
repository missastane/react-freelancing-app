import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncRolePermissions } from "../../../services/admin/admin-role.service";

export const useSyncRolePermissions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncRolePermissions,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "roles"],
            });
        },
    });
};