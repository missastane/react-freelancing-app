import { z } from "zod";

export const createRegisterSchema = (t) =>
    z
        .object({
            email: z
                .string()
                .min(1, t("validation.emailRequired"))
                .email(t("validation.emailInvalid")),

            role: z.enum(["1", "2"]),

            password: z.string().superRefine((value, ctx) => {
                if (!value) {
                    ctx.addIssue({
                        code: "custom",
                        message: t("validation.passwordRequired"),
                    });
                } else if (value.length < 8) {
                    ctx.addIssue({
                        code: "custom",
                        message: t("validation.passwordMin"),
                    });
                }
            }),

            password_confirmation: z
                .string()
                .min(1, t("validation.confirmPasswordRequired")),
        })
        .refine(
            (data) =>
                !data.password_confirmation ||
                data.password === data.password_confirmation,
            {
                message: t("validation.passwordMismatch"),
                path: ["password_confirmation"],
            }
        );