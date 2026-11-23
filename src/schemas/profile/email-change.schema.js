import { z } from "zod";

export const requestEmailChangeSchema = (t) =>
    z.object({
        email: z
            .string()
            .trim()
            .min(1, t("profile.emailChange.validation.emailRequired"))
            .email(t("profile.emailChange.validation.emailInvalid")),

        current_password: z
            .string()
            .min(1, t("profile.emailChange.validation.passwordRequired")),
    });