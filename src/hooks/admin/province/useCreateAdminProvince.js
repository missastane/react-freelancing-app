
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminProvince } from "../../../services/admin/admin-province.service";

export const useCreateAdminProvince = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdminProvince,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "provinces"],
            });
        },
    });
};
