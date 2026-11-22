import { useQuery } from "@tanstack/react-query";
import { getAdminSubscriptions } from "../../../services/admin/admin-subscription.service";

export const useAdminSubscriptions = ({ page, perPage, search }) => {
    return useQuery({
        queryKey: ["admin", "subscriptions", { page, perPage, search }],
        queryFn: () => getAdminSubscriptions(page, perPage, search),
        placeholderData: (previousData) => previousData,
    });
};