
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminPermission } from "../../../services/admin/admin-permission.service";

export const useCreateAdminPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminPermission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "permissions"],
            });
        },
    });
};
