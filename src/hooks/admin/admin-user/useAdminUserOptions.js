import { useQuery } from "@tanstack/react-query";
import { getAdminUserOptions } from "../../../services/admin/admin-user.service";

export const useAdminUserOptions = () => {
    return useQuery({
        queryKey: ["admin", "users", "options"],
        queryFn: getAdminUserOptions,
        staleTime: 5 * 60 * 1000,
    });
};