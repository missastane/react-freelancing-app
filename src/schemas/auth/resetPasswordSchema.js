
import { z } from "zod";

export const createResetPasswordSchema = (t) =>
    z
        .object({
            password: z
                .string()
                .min(8, t("validation.passwordMin")),

            password_confirmation: z
                .string()
                .min(1, t("validation.confirmPasswordRequired")),
        })
        .refine(
            (data) => data.password === data.password_confirmation,
            {
                message: t("validation.passwordMismatch"),
                path: ["password_confirmation"],
            }
        );
