
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminProvince } from "../../../services/admin/admin-province.service";

export const useUpdateAdminProvince = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ provinceId, data }) =>
            updateAdminProvince(provinceId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "provinces"],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "admin",
                    "provinces",
                    "detail",
                    variables.provinceId,
                ],
            });
        },
    });
};
