
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminCity } from "../../../services/admin/admin-city.service";

export const useDeleteAdminCity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cityId) => deleteAdminCity(cityId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "cities"],
            });
        },
    });
};
