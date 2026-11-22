import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminSubscription } from "../../../services/admin/admin-subscription.service";

export const useUpdateAdminSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ subscriptionId, data }) =>
            updateAdminSubscription(subscriptionId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "subscriptions"],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "admin",
                    "subscriptions",
                    "detail",
                    variables.subscriptionId,
                ],
            });
        },
    });
};