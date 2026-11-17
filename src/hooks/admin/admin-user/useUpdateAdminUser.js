import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUser } from "../../../services/admin/admin-user.service";

export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ adminId, data }) =>
            updateAdminUser(adminId, data),

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