import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminRole } from "../../../services/admin/admin-role.service";

export const useDeleteAdminRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminRole,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "roles"],
            });
        },
    });
};