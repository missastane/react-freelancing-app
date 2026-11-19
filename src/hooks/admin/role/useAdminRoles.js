import { useQuery } from "@tanstack/react-query";
import { getAdminRoles } from "../../../services/admin/admin-role.service";

export const useAdminRoles = ({ page, perPage, search }) => {
    return useQuery({
        queryKey: ["admin", "roles", { page, perPage, search }],
        queryFn: () => getAdminRoles(page, perPage, search),
        placeholderData: (previousData) => previousData,
    });
};