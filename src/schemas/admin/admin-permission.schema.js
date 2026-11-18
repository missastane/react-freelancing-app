import { z } from "zod";

export const createAdminPermissionSchema = (t) =>
    z.object({
        name: z
            .string()
            .min(1, t("admin.permissions.validation.nameRequired"))
            .regex(
                /^[a-zA-Z][a-zA-Z0-9_]*$/,
                t("admin.permissions.validation.nameInvalid")
            ),
    });

export const updateAdminPermissionSchema = (t) =>
    z.object({
        name: z
            .string()
            .min(1, t("admin.permissions.validation.nameRequired"))
            .regex(
                /^[a-zA-Z][a-zA-Z0-9_]*$/,
                t("admin.permissions.validation.nameInvalid")
            ),
    });