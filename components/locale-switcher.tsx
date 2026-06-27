"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { setLocale } from "@/app/actions/locale"
import { LOCALE_DISPLAY_ORDER, type AppLocale } from "@/i18n/config"

export function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale()
  const [pending, startTransition] = useTransition()

  const choose = (locale: AppLocale) => {
    if (locale === active) return
    startTransition(() => {
      void setLocale(locale)
    })
  }

  return (
    <div className={className}>
      {LOCALE_DISPLAY_ORDER.map((locale) => (
        <button
          key={locale}
          type="button"
          disabled={pending}
          onClick={() => choose(locale)}
          aria-pressed={active === locale}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-60",
            active === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
