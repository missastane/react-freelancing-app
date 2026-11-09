import { z } from "zod";

export const createForgotPasswordSchema = (t) =>
    z.object({
        email: z
            .string()
            .min(1, t("validation.emailRequired"))
            .email(t("validation.emailInvalid")),
    });
