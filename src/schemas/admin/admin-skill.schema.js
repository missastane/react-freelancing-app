import { z } from "zod";

export const createAdminSkillSchema = (t) =>
    z.object({
        persian_title: z
            .string()
            .min(1, t("admin.skills.validation.persianTitleRequired"))
            .regex(
                /^[ا-یء-ي۰-۹ ]+$/u,
                t("admin.skills.validation.persianTitleInvalid")
            ),

        original_title: z
            .string()
            .min(1, t("admin.skills.validation.originalTitleRequired"))
            .regex(
                /^[a-zA-Z0-9 ]+$/,
                t("admin.skills.validation.originalTitleInvalid")
            ),
    });

export const updateAdminSkillSchema = createAdminSkillSchema;