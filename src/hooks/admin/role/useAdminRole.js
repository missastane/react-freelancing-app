import { useQuery } from "@tanstack/react-query";
import { getAdminRole } from "../../../services/admin/admin-role.service";

export const useAdminRole = (roleId) => {
    return useQuery({
        queryKey: ["admin", "roles", "detail", roleId],
        queryFn: () => getAdminRole(roleId),
        enabled: !!roleId,
    });
};