
import { useQuery } from "@tanstack/react-query";
import { getAdminCity } from "../../../services/admin/admin-city.service";

export const useAdminCity = (cityId) => {
    return useQuery({
        queryKey: ["admin", "cities", "detail", cityId],
        queryFn: () => getAdminCity(cityId),
        enabled: !!cityId,
    });
};
