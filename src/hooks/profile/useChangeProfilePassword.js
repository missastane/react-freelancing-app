import { useMutation } from "@tanstack/react-query";

import { changeProfilePassword } from "../../services/profile.service";

export const useChangeProfilePassword = () => {
    return useMutation({
        mutationFn: changeProfilePassword,
    });
};