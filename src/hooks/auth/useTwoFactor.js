
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    startTwoFactorSetup,
    confirmTwoFactorSetup,
    disableTwoFactor,
} from "../../services/twoFactor.service";

export const useStartTwoFactorSetup = () => {
    return useMutation({
        mutationFn: startTwoFactorSetup,
    });
};

export const useConfirmTwoFactorSetup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: confirmTwoFactorSetup,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};

export const useDisableTwoFactor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: disableTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};
