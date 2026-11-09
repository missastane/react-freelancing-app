
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export function createEmotionCache(direction) {
    return createCache({
        key: direction === "rtl" ? "muirtl" : "mui",
        stylisPlugins:
            direction === "rtl"
                ? [prefixer, rtlPlugin]
                : [prefixer],
    });
}
