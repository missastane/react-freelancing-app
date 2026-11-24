
import { z } from "zod";

export const accountDeletionSchema = (t) =>
    z.object({
        password: z
            .string()
            .min(1, t("settings.account.accountDeletion.validation.passwordRequired")),

        reason: z
            .string()
            .max(
                1000,
                t("settings.account.accountDeletion.validation.reasonMaxLength")
            )
            .optional()
            .or(z.literal("")),
    });
