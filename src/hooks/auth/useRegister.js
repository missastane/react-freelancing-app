
import { useMutation } from "@tanstack/react-query";
import { register } from "../../services/auth.service";

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};
