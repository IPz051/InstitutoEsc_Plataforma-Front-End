import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock3, GraduationCap, MapPin, PlayCircle, Users } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AppNavbar } from "@/components/app-navbar"
import { ExpandableText } from "@/components/expandable-text"
import { ProfessorTagCard } from "@/components/professor-tag-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getInPersonProfessorTags } from "@/lib/in-person-professor-tags"
import { getInPersonCourse, inPersonCourses } from "@/lib/mock-data"

export default async function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const t = await getTranslations()
  const { courseId } = await params
  const course = getInPersonCourse(courseId)
  if (!course) notFound()
  const meta = inPersonCourses.find((c) => c.id === courseId)
  const professorTags = getInPersonProfessorTags(courseId)
  const firstLessonId = course.modules[0]?.lessons[0]?.id ?? "demo"

  return (
    <>
      <AppNavbar title={t("inPersonCourses.title")} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/courses?type=in-person"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("inPersonCourses.back")}
        </Link>

        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              {t("inPersonCourses.badge")}
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {course.title}
            </h2>
            <ExpandableText text={course.description} />

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span>{meta?.date ?? t("inPersonCourses.dateTBC")}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{meta?.venue ?? t("inPersonCourses.venueTBC")}</span>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-fit">
              <Link href={`/in-person-courses/${course.id}/lesson/${firstLessonId}`}>
                <PlayCircle className="h-4 w-4" />
                {t("inPersonCourses.watchDemo")}
              </Link>
            </Button>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-secondary/50">
            <Image
              src={course.thumbnail}
              alt={`Imagem representativa do curso ${course.title}`}
              fill
              priority
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
              style={{ objectPosition: meta?.heroPosition ?? "center" }}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            {t("inPersonCourses.courseInfo")}
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
                      {t("inPersonCourses.subject")}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{meta?.area ?? t("inPersonCourses.toDefine")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="professores" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">{t("inPersonCourses.professors")}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {professorTags?.length ? (
                  <div className="flex flex-col gap-3">
                    {professorTags.map((professor) => (
                      <ProfessorTagCard
                        key={`${professor.name}-${professor.imageSrc}`}
                        professor={professor}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {(meta?.professors?.length ? meta.professors : [t("inPersonCourses.toDefine")]).map((professor) => (
                      <li key={professor}>{professor}</li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="duracao" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">{t("inPersonCourses.duration")}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{meta?.duration ?? t("inPersonCourses.toDefine")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metodologia" className="overflow-hidden rounded-xl border border-border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">{t("inPersonCourses.methodology")}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {(meta?.methodology?.length ? meta.methodology : [t("inPersonCourses.contentInProgress")]).map((item) => (
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
