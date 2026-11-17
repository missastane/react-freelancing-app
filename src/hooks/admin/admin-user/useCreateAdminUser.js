
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser } from "../../../services/admin/admin-user.service";

export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminUser,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
};
