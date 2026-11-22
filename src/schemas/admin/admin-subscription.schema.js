import { z } from "zod";

export const createAdminSubscriptionSchema = (t) =>
    z.object({
        name: z
            .string()
            .min(2, t("validation.min", { min: 2 }))
            .max(255, t("validation.max", { max: 255 }))
            .regex(/^[^<>]+$/u, t("validation.invalidFormat")),

        amount: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+(\.\d+)?$/, t("validation.numeric"))
            .transform(Number),

        duration_days: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        commission_rate: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .refine((value) => Number(value) >= 0 && Number(value) <= 99, {
                message: t("validation.range", { min: 0, max: 99 }),
            })
            .transform(Number),

        max_target_per_month: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        max_notification_per_month: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        max_email_per_month: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        max_sms_per_month: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        max_view_deatils_per_month: z
            .string()
            .min(1, t("validation.required"))
            .regex(/^\d+$/, t("validation.integer"))
            .transform(Number),

        features: z
            .array(
                z.object({
                    feature_key: z
                        .string()
                        .trim()
                        .min(1, t("admin.subscriptions.validation.featureKeyRequired"))
                        .regex(
                            /^[a-zA-Z][a-zA-Z0-9_]*$/,
                            t("validation.invalidFormat")
                        ),

                    feature_persian_key: z
                        .string()
                        .trim()
                        .min(
                            1,
                            t("admin.subscriptions.validation.featurePersianKeyRequired")
                        ),

                    feature_value: z
                        .string()
                        .trim()
                        .min(
                            1,
                            t("admin.subscriptions.validation.featureValueRequired")
                        ),

                    feature_value_type: z
                        .string()
                        .trim()
                        .min(
                            1,
                            t("admin.subscriptions.validation.featureValueTypeRequired")
                        )
                        .regex(
                            /^[a-zA-Z][a-zA-Z0-9_]*$/,
                            t("validation.invalidFormat")
                        ),

                    is_limited: z.boolean(),
                })
            )
            .optional()
            .nullable()
            .transform((features) =>
                features?.length ? features : undefined
            ),
    });

export const updateAdminSubscriptionSchema = (t) =>
    z.object({
        name: z
            .string()
            .min(2, t("validation.min", { min: 2 }))
            .max(255, t("validation.max", { max: 255 }))
            .regex(/^[^<>]+$/u, t("validation.invalidFormat")),
    });