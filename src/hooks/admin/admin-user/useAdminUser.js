import { useQuery } from "@tanstack/react-query";
import { getAdminUser } from "../../../services/admin/admin-user.service";

export const useAdminUser = (adminId) => {
    return useQuery({
        queryKey: ["admin", "users", "detail", adminId],
        queryFn: () => getAdminUser(adminId),
        enabled: Boolean(adminId),
    });
};