
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminCity } from "../../../services/admin/admin-city.service";

export const useCreateAdminCity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ provinceId, data }) =>
            createAdminCity(provinceId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "cities"],
            });
        },
    });
};
