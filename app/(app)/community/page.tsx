import { getTranslations } from "next-intl/server"
import { CommunityFeed } from "@/components/community-feed"

export default async function ComunidadePage() {
  const t = await getTranslations()
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{t("community.heading")}</h1>
        <p className="mt-1 text-muted-foreground">
          {t("community.subtitle")}
        </p>
      </div>
      <CommunityFeed />
    </div>
  )
}
