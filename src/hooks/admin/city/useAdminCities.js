
import { useQuery } from "@tanstack/react-query";
import { getAdminCities } from "../../../services/admin/admin-city.service";

export const useAdminCities = ({
    provinceId,
    page,
    perPage,
    search,
}) => {
    return useQuery({
        queryKey: ["admin", "cities", { provinceId, page, perPage, search }],
        queryFn: () => getAdminCities(provinceId, page, perPage, search),
        enabled: !!provinceId,
        placeholderData: (previousData, previousQuery) => {
            return previousQuery?.queryKey?.[2]?.provinceId === provinceId
                ? previousData
                : undefined;
        },
    });
};
