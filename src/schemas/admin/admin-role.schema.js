import { z } from "zod";

export const createAdminRoleSchema = (t) =>
    z.object({
        name: z
            .string()
            .trim()
            .min(1, t("admin.roles.validation.nameRequired")),
    });

export const updateAdminRoleSchema = (t) =>
    z.object({
        name: z
            .string()
            .trim()
            .min(1, t("admin.roles.validation.nameRequired")),
    });