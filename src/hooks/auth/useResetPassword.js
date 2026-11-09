import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/auth.service";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};