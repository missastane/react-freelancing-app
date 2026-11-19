
import { z } from "zod";

export const createAdminCitySchema = (t) =>
    z.object({
        name: z
            .string()
            .min(1, t("admin.cities.validation.nameRequired"))
            .regex(
                /^[\p{L}\s\u200c\-']+$/u,
                t("admin.cities.validation.nameInvalid")
            ),
    });

export const updateAdminCitySchema = createAdminCitySchema;