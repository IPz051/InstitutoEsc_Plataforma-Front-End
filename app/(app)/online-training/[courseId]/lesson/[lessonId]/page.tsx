import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AppNavbar } from "@/components/app-navbar"
import { LessonView } from "@/components/lesson-view"
import { getLessonContext } from "@/lib/mock-data"

export default async function OnlineLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const t = await getTranslations()
  const { courseId, lessonId } = await params
  const context = getLessonContext(courseId, lessonId)
  if (!context) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar title={context.course.title} />
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <Link
          href={`/online-training/${context.course.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("lesson.backToCourse")}
        </Link>
      </div>
      <LessonView
        course={context.course}
        current={context.current}
        prev={context.prev}
        next={context.next}
        basePath="/online-training"
      />
    </div>
  )
}
