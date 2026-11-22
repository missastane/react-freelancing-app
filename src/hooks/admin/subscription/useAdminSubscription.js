import { useQuery } from "@tanstack/react-query";
import { getAdminSubscription } from "../../../services/admin/admin-subscription.service";

export const useAdminSubscription = (subscriptionId) => {
    return useQuery({
        queryKey: ["admin", "subscriptions", "detail", subscriptionId],
        queryFn: () => getAdminSubscription(subscriptionId),
        enabled: !!subscriptionId,
    });
};