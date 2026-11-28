import { useMutation } from "@tanstack/react-query";
import { verifyTwoFactorLogin } from "../../services/auth.service";

export const useVerifyTwoFactorLogin = () => {
    return useMutation({
        mutationFn: verifyTwoFactorLogin,
    });
};