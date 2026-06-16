import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { LessonView } from "@/components/lesson-view"
import { getLessonContext } from "@/lib/mock-data"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const ctx = getLessonContext(courseId, lessonId)
  if (!ctx) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar title={ctx.course.title} />
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <Link
          href={`/cursos/${ctx.course.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao curso
        </Link>
      </div>
      <LessonView
        course={ctx.course}
        current={ctx.current}
        prev={ctx.prev}
        next={ctx.next}
      />
    </div>
  )
}
