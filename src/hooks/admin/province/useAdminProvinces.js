import { useQuery } from "@tanstack/react-query";
import { getAdminProvinces } from "../../../services/admin/admin-province.service";

export const useAdminProvinces = ({ page, perPage, search }) => {
    return useQuery({
        queryKey: ["admin", "provinces", { page, perPage, search }],
        queryFn: () => getAdminProvinces(page, perPage, search),
        placeholderData: (previousData) => previousData,
    });
};