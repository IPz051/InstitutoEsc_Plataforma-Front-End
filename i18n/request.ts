import { getRequestConfig } from "next-intl/server"
import { DEFAULT_LOCALE, type AppLocale } from "./config"

export default getRequestConfig(async () => {
  // Locked to Portuguese for now (no English translation exposed). To re-enable
  // bilingual switching, restore the cookie read below and the <LocaleSwitcher/>.
  const locale: AppLocale = DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
