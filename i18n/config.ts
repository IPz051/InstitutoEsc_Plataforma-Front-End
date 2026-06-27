// Client-safe i18n constants. No server-only imports here so this module can be
// imported from both Server and Client Components.

export const SUPPORTED_LOCALES = ["en", "pt"] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

// App is Portuguese-only for now. English (`en`) stays defined so the dictionary
// and switcher can be re-enabled later, but it is not currently selectable.
export const DEFAULT_LOCALE: AppLocale = "pt"
export const LOCALE_COOKIE = "LOCALE"

// Display order for the locale switcher (PT first to match the original toggle).
export const LOCALE_DISPLAY_ORDER: readonly AppLocale[] = ["pt", "en"]

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "pt"
}
