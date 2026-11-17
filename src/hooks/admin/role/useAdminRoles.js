import { useQuery } from "@tanstack/react-query";
import { getAdminRoles } from "../../../services/admin/admin-role.service";

export const useAdminRoles = ({ page, perPage }) => {
    return useQuery({
        queryKey: ["admin", "roles", { page, perPage }],
        queryFn: () => getAdminRoles(page, perPage),
        placeholderData: (previousData) => previousData,
    });
};