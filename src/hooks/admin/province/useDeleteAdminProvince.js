import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminProvince } from "../../../services/admin/admin-province.service";

export const useDeleteAdminProvince = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminProvince,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "provinces"],
            });
        },
    });
};