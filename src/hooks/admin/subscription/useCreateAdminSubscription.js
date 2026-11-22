import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminSubscription } from "../../../services/admin/admin-subscription.service";

export const useCreateAdminSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "subscriptions"],
            });
        },
    });
};