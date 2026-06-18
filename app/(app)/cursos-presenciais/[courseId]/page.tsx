import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock3, GraduationCap, MapPin, PlayCircle, Users } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { ExpandableText } from "@/components/expandable-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getInPersonCourse, inPersonCourses } from "@/lib/mock-data"

export default async function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = getInPersonCourse(courseId)
  if (!course) notFound()
  const meta = inPersonCourses.find((c) => c.id === courseId)
  const firstLessonId = course.modules[0]?.lessons[0]?.id ?? "demo"

  return (
    <>
      <AppNavbar title="Cursos presenciais" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/cursos?tipo=presenciais"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>

        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              Cursos presenciais
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {course.title}
            </h2>
            <ExpandableText text={course.description} />

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span>{meta?.date ?? "Data a confirmar"}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{meta?.local ?? "Local a confirmar"}</span>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-fit">
              <Link href={`/cursos-presenciais/${course.id}/aula/${firstLessonId}`}>
                <PlayCircle className="h-4 w-4" />
                Assistir vídeo DEMO
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-secondary/50 p-6">
            <p className="font-heading text-sm font-semibold text-foreground">Resumo do curso</p>
            <div className="flex items-start gap-2 text-sm text-foreground">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Matéria / Área do direito</p>
                <p className="text-muted-foreground">{meta?.area ?? "A definir"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-foreground">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Professores</p>
                <p className="text-muted-foreground">{meta?.professors?.join(", ") ?? "A definir"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-foreground">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Duração</p>
                <p className="text-muted-foreground">{meta?.duration ?? "A definir"}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Informações do curso
          </h3>
          <Accordion
            type={"multiple" as const}
            defaultValue={["area", "professores", "duracao", "metodologia"]}
            className="flex flex-col gap-3"
          >
            <AccordionItem value="area" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">
                      Matéria / Área do direito
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{meta?.area ?? "A definir"}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="professores" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">Professores</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {(meta?.professors?.length ? meta.professors : ["A definir"]).map((professor) => (
                    <li key={professor}>{professor}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="duracao" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">Duração</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{meta?.duration ?? "A definir"}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metodologia" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">Metodologia / Módulos</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {(meta?.methodology?.length ? meta.methodology : ["Conteúdo em definição"]).map((item) => (
                    <li key={item} className="whitespace-pre-line leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </>
  )
}
