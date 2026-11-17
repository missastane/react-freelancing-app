
import { z } from "zod";

const persianEnglishNameRegex = /^[ا-یa-zA-Zء-ي ]+$/u;

export const createAdminSchema = (t) =>
    z.object({
        first_name: z
            .string()
            .trim()
            .min(1, t("admin.users.validation.firstNameRequired"))
            .max(120, t("admin.users.validation.firstNameMax"))
            .regex(
                persianEnglishNameRegex,
                t("admin.users.validation.invalidName")
            ),

        last_name: z
            .string()
            .trim()
            .min(1, t("admin.users.validation.lastNameRequired"))
            .max(120, t("admin.users.validation.lastNameMax"))
            .regex(
                persianEnglishNameRegex,
                t("admin.users.validation.invalidName")
            ),

        mobile: z
            .string()
            .trim()
            .regex(
                /^\d{11}$/,
                t("admin.users.validation.mobileLength")
            ),

        email: z
            .string()
            .trim()
            .min(1, t("admin.users.validation.emailRequired"))
            .email(t("admin.users.validation.invalidEmail")),
    });


    export const updateAdminSchema = (t) =>
    z.object({
        first_name: z.string()
            .trim()
            .min(1, t("admin.users.validation.firstNameRequired"))
            .max(120, t("admin.users.validation.firstNameMax"))
            .regex(
                persianEnglishNameRegex,
                t("admin.users.validation.invalidName")
            ),

        last_name: z.string()
            .trim()
            .min(1, t("admin.users.validation.lastNameRequired"))
            .max(120, t("admin.users.validation.lastNameMax"))
            .regex(
                persianEnglishNameRegex,
                t("admin.users.validation.invalidName")
            ),

        activation: z.coerce.number()
            .refine(
                (value) => [1, 2].includes(value),
                t("admin.users.validation.invalidActivation")
            ),
    });
