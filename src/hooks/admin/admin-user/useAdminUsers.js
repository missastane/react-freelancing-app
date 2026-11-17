
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "../../../services/admin/admin-user.service";

export const useAdminUsers = ({
    page = 1,
    perPage = 15,
    search = "",
} = {}) => {
    const normalizedSearch = search.trim();

    return useQuery({
        queryKey: [
            "admin",
            "users",
            {
                page,
                perPage,
                search: normalizedSearch,
            },
        ],
        queryFn: () =>
            getAdminUsers(page, perPage, normalizedSearch),
        placeholderData: (previousData) => previousData,
    });
};
