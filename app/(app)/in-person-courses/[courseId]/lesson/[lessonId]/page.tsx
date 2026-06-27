import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { LessonView } from "@/components/lesson-view"
import { getInPersonProfessorTags } from "@/lib/in-person-professor-tags"
import { getInPersonLessonContext } from "@/lib/mock-data"

export default async function InPersonLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const context = getInPersonLessonContext(courseId, lessonId)
  if (!context) notFound()
  const professorTags = getInPersonProfessorTags(courseId)

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar title={context.course.title} />
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <Link
          href="/courses?type=in-person"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>
      </div>
      <LessonView
        course={context.course}
        current={context.current}
        prev={context.prev}
        next={context.next}
        basePath="/in-person-courses"
        professorTags={professorTags}
      />
    </div>
  )
}
