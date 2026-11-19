
import { useQuery } from "@tanstack/react-query";
import { getAdminProvince } from "../../../services/admin/admin-province.service";

export const useAdminProvince = (provinceId) => {
    return useQuery({
        queryKey: ["admin", "provinces", "detail", provinceId],
        queryFn: () => getAdminProvince(provinceId),
        enabled: !!provinceId,
    });
};
