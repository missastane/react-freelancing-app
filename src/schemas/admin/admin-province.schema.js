
import { z } from "zod";

export const createAdminProvinceSchema = (t) =>
    z.object({
        name: z
            .string()
            .min(2, t("admin.provinces.validation.nameMin"))
            .max(120, t("admin.provinces.validation.nameMax"))
            .regex(
                /^[\p{L}\s\u200c\-']+$/u,
                t("admin.provinces.validation.nameInvalid")
            ),
    });

export const updateAdminProvinceSchema = createAdminProvinceSchema;