import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Clock,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  FileText,
  ArrowLeft,
  User,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getCourse } from "@/lib/mock-data"

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = getCourse(courseId)
  if (!course) notFound()

  const firstUnfinished =
    course.modules.flatMap((m) => m.lessons).find((l) => !l.completed) ??
    course.modules[0]?.lessons[0]

  return (
    <>
      <AppNavbar title="Curso" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/cursos"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Meus Cursos
        </Link>

        {/* Hero do curso */}
        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              {course.category}
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {course.title}
            </h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-accent" />
                <div className="leading-tight">
                  <p className="font-medium">{course.professor}</p>
                  <p className="text-xs text-muted-foreground">{course.professorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{course.workload}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-4 w-4 text-accent" />
                <span>{course.totalLessons} aulas</span>
              </div>
            </div>

            {firstUnfinished && (
              <Button asChild size="lg" className="mt-6 w-fit">
                <Link href={`/cursos/${course.id}/aula/${firstUnfinished.id}`}>
                  <PlayCircle className="h-4 w-4" />
                  {course.progress > 0 ? "Continuar curso" : "Começar curso"}
                </Link>
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-secondary/50 p-6">
            <ProgressRing value={course.progress} sublabel="concluído" />
            <p className="text-center text-sm text-muted-foreground">
              {course.modules.reduce(
                (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
                0,
              )}{" "}
              de {course.totalLessons} aulas concluídas
            </p>
          </div>
        </section>

        {/* Conteúdo / Módulos */}
        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Conteúdo do curso
          </h3>
          <Accordion
            type="multiple"
            defaultValue={course.modules.map((m) => m.id)}
            className="flex flex-col gap-3"
          >
            {course.modules.map((mod, i) => {
              const done = mod.lessons.filter((l) => l.completed).length
              return (
                <AccordionItem
                  key={mod.id}
                  value={mod.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex flex-1 items-center gap-3 text-left">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {mod.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {done}/{mod.lessons.length} aulas
                          {mod.exam ? " • 1 prova" : ""}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-2">
                    <ul className="flex flex-col">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/cursos/${course.id}/aula/${lesson.id}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                            ) : (
                              <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                            )}
                            <span className="flex-1 text-sm text-foreground">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </Link>
                        </li>
                      ))}
                      {mod.exam && (
                        <li>
                          <Link
                            href={`/cursos/${course.id}/prova/${mod.exam.id}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gold/15 text-gold-foreground">
                              {mod.exam.passed ? (
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                              ) : (
                                <FileText className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="flex-1 text-sm font-medium text-foreground">
                              {mod.exam.title}
                            </span>
                            {mod.exam.passed ? (
                              <Badge
                                variant="outline"
                                className="border-accent/20 bg-accent/10 text-xs text-accent"
                              >
                                Aprovado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Prova
                              </Badge>
                            )}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </section>
      </div>
    </>
  )
}
