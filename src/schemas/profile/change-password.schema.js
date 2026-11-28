import { z } from "zod";

export const changePasswordSchema = (t) =>
    z
        .object({
            current_password: z
                .string()
                .min(1, t("profile.changePassword.validation.currentRequired"))
                .min(8, t("profile.changePassword.validation.currentMin")),

            new_password: z
                .string()
                .min(1, t("profile.changePassword.validation.newRequired"))
                .min(8, t("profile.changePassword.validation.min"))
                .regex(/[a-z]/, t("profile.changePassword.validation.lowercase"))
                .regex(/[A-Z]/, t("profile.changePassword.validation.uppercase"))
                .regex(/[0-9]/, t("profile.changePassword.validation.number"))
                .regex(/[^a-zA-Z0-9]/, t("profile.changePassword.validation.symbol")),

            new_password_confirmation: z
                .string()
                .min(1, t("profile.changePassword.validation.confirmRequired")),
        })
        .refine(
            (data) => data.new_password === data.new_password_confirmation,
            {
                path: ["new_password_confirmation"],
                message: t("profile.changePassword.validation.mismatch"),
            }
        );