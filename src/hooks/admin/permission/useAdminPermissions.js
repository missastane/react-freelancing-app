import { useQuery } from "@tanstack/react-query";
import { getAdminPermissions } from "../../../services/admin/admin-permission.service";

export const useAdminPermissions = ({ page, perPage, search }) => {
    return useQuery({
        queryKey: ["admin", "permissions", { page, perPage, search }],
        queryFn: () => getAdminPermissions(page, perPage, search),
        placeholderData: (previousData) => previousData,
    });
};