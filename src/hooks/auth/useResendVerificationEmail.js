import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "../../services/auth.service";

export const useResendVerificationEmail = () => {
    return useMutation({
        mutationFn: resendVerificationEmail,
    });
};