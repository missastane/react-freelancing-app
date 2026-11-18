import { useQuery } from "@tanstack/react-query";
import { getAdminPermission } from "../../../services/admin/admin-permission.service";

export const useAdminPermission = (permissionId) => {
    return useQuery({
        queryKey: ["admin", "permissions", permissionId],
        queryFn: () => getAdminPermission(permissionId),
        enabled: !!permissionId,
    });
};