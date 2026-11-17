import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleAdminUserActivation } from "../../../services/admin/admin-user.service";

export const useToggleAdminUserActivation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleAdminUserActivation,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
};