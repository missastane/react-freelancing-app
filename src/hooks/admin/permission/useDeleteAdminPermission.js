import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminPermission } from "../../../services/admin/admin-permission.service";

export const useDeleteAdminPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminPermission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "permissions"],
            });
        },
    });
};