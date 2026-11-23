import { z } from "zod";

export const requestMobileChangeSchema = (t) =>
    z.object({
        id: z
            .string()
            .trim()
            .min(1, t("profile.mobileChange.validation.mobileRequired"))
            .regex(
                /^09\d{9}$/,
                t("profile.mobileChange.validation.mobileInvalid")
            ),
    });

export const confirmMobileChangeSchema = (t) =>
    z.object({
        otp: z
            .string()
            .trim()
            .min(1, t("profile.mobileChange.validation.otpRequired"))
            .regex(
                /^\d{6}$/,
                t("profile.mobileChange.validation.otpInvalid")
            ),
    });