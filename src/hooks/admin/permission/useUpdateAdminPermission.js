import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminPermission } from "../../../services/admin/admin-permission.service";

export const useUpdateAdminPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminPermission,
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