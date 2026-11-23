
import { useMutation } from "@tanstack/react-query";
import { requestEmailChange } from "../../services/profile.service";

export const useRequestEmailChange = () => {
    return useMutation({
        mutationFn: requestEmailChange,
    });
};

