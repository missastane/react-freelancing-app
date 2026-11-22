import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminSubscription } from "../../../services/admin/admin-subscription.service";

export const useDeleteAdminSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (subscriptionId) =>
            deleteAdminSubscription(subscriptionId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "subscriptions"],
            });
        },
    });
};