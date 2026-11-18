import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncPermissionRoles } from "../../../services/admin/admin-permission.service";

export const useSyncPermissionRoles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncPermissionRoles,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "permissions"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "permissions", variables.permissionId],
            });
        },
    });
};