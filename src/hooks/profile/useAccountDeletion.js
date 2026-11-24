
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    requestAccountDeletion,
    cancelAccountDeletion,
} from "../../services/profile.service";

export const useRequestAccountDeletion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: requestAccountDeletion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};

export const useCancelAccountDeletion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelAccountDeletion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};
