import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    requestMobileChange,
    confirmMobileChange,
} from "../../services/profile.service";

export const useRequestMobileChange = () => {
    return useMutation({
        mutationFn: requestMobileChange,
    });
};

export const useConfirmMobileChange = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: confirmMobileChange,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};