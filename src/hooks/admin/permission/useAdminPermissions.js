import { useQuery } from "@tanstack/react-query";
import { getAdminPermissions } from "../../../services/admin/admin-permission.service";

export const useAdminPermissions = ({ page, perPage }) => {
    return useQuery({
        queryKey: ["admin", "permissions", { page, perPage }],
        queryFn: () => getAdminPermissions(page, perPage),
        placeholderData: (previousData) => previousData,
    });
};