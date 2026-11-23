
/**
 * Formats a date according to the selected language.
 *
 * Persian language  -> Jalali calendar
 * Other languages   -> Gregorian calendar
 *
 * Supported inputs:
 * - YYYY-MM-DD
 * - YYYY-MM-DDTHH:mm:ss.sssZ (ISO 8601)
 * - YYYY-MM-DD HH:mm:ss (SQL datetime)
 * - YYYY/MM/DD
 * - Date objects
 * - Unix timestamps (milliseconds)
 */
export function formatLocalizedDate(
    value,
    language = "en",
    options = {}
) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const isPersian = language.startsWith("fa");

    const locale = isPersian
        ? "fa-IR-u-ca-persian"
        : "en-US-u-ca-gregory";

    let date;

    if (value instanceof Date) {
        date = value;
    } else if (typeof value === "number") {
        date = new Date(value);
    } else if (typeof value === "string") {
        // Extract date components from ISO or SQL date strings.
        const match = value.match(
            /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:$|[T\s])/
        );

        if (match) {
            const [, year, month, day] = match.map(Number);

            date = new Date(Date.UTC(year, month - 1, day));

            // Validate date components.
            if (
                date.getUTCFullYear() !== year ||
                date.getUTCMonth() !== month - 1 ||
                date.getUTCDate() !== day
            ) {
                return value;
            }
        } else {
            date = new Date(value);
        }
    } else {
        return "";
    }

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
        ...options,
    }).format(date);
}
