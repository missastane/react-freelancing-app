
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminCity } from "../../../services/admin/admin-city.service";

export const useUpdateAdminCity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cityId, data }) =>
            updateAdminCity(cityId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "cities"],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "admin",
                    "cities",
                    "detail",
                    variables.cityId,
                ],
            });
        },
    });
};
