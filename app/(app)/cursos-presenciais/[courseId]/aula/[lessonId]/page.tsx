import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { LessonView } from "@/components/lesson-view"
import { inPersonCourses } from "@/lib/mock-data"

const DEMO_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default async function InPersonLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const inPerson = inPersonCourses.find((c) => c.id === courseId)
  if (!inPerson) notFound()

  if (lessonId !== "demo") notFound()

  const course = {
    id: inPerson.id,
    title: inPerson.title,
    shortDescription: "Aula demonstrativa",
    description:
      "Conteúdo de demonstração para a área de cursos presenciais. Este vídeo é apenas uma prévia.",
    professor: "Instituto ESC",
    professorRole: "Demonstração",
    workload: "10 min",
    totalLessons: 1,
    progress: 0,
    status: "nao-iniciado" as const,
    category: "Cursos presenciais",
    thumbnail: "/placeholder.svg",
    modules: [
      {
        id: "demo-mod-1",
        title: "Aula demonstrativa",
        lessons: [
          {
            id: "demo",
            title: "Vídeo DEMO — demonstração",
            duration: "10 min",
            completed: false,
            description:
              "Assista a uma prévia do conteúdo para entender a experiência de aula dentro da plataforma.",
            videoUrl: DEMO_VIDEO_URL,
          },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar title={inPerson.title} />
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <Link
          href="/cursos?tipo=presenciais"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>
      </div>
      <LessonView
        course={course}
        current={{ lesson: course.modules[0].lessons[0], moduleTitle: course.modules[0].title }}
        basePath="/cursos-presenciais"
      />
    </div>
  )
}

