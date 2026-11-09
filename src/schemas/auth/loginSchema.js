import { z } from "zod";

export const createLoginSchema = (t) =>
    z.object({
        email: z
            .string()
            .min(1, t("validation.emailRequired"))
            .email(t("validation.emailInvalid")),

        password: z
            .string()
            .min(1, t("validation.passwordRequired")),
    });