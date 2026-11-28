
import { z } from "zod";

export const createTwoFactorLoginSchema = (t, method) =>
    z.object({
        code: z
            .string()
            .trim()
            .min(1, t("validation.twoFactorCodeRequired"))
            .regex(
                method === "authenticator"
                    ? /^\d{6}$/
                    : /^[a-fA-F0-9]{10}$/,
                t(
                    method === "authenticator"
                        ? "validation.authenticatorCodeInvalid"
                        : "validation.recoveryCodeInvalid"
                )
            ),
    });
