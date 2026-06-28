"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  PlayCircle,
  Users,
  Link as LinkIcon,
  Download,
  FileText,
} from "lucide-react"
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
import { getCourseById } from "@/services/courses/coursesService"
import { getInstructorById } from "@/services/instructors/instructorsService"
import type { CourseDetailResponse, InstructorDetailResponse } from "@/types"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const [course, setCourse] = useState<CourseDetailResponse | null>(null)
  const [instructor, setInstructor] = useState<InstructorDetailResponse | null>(null)
  const [mockCourse, setMockCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        // Fetch from API contract GET /courses/{id}
        const data = await getCourseById(courseId)
        setCourse(data)
        
        // Fetch instructor data if instructorId is returned by the course details endpoint
        if (data.instructorId) {
          try {
            const instData = await getInstructorById(data.instructorId)
            setInstructor(instData)
          } catch (instErr) {
            console.warn(`Failed to load instructor ${data.instructorId}:`, instErr)
          }
        }
        
        // Also fetch local metadata to combine if available
        const localMock = getInPersonCourse(courseId)
        if (localMock) {
          setMockCourse(localMock)
        }
        setIsFallback(false)
      } catch (error) {
        console.warn(`API call failed for in-person courseId ${courseId}, trying fallback:`, error)
        const localMock = getInPersonCourse(courseId)
        if (localMock) {
          setMockCourse(localMock)
          setIsFallback(true)
        } else {
          setMockCourse(null)
          setIsFallback(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <>
        <AppNavbar title="Cursos presenciais" />
        <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
          <div className="h-6 w-32 rounded bg-muted/20" />
          <div className="h-64 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
          <div className="h-10 w-48 rounded bg-muted/20" />
          <div className="h-32 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
        </div>
      </>
    )
  }

  if (!course && !mockCourse) {
    notFound()
  }

  // Local meta reference
  const meta = inPersonCourses.find((c) => c.id === courseId)
  const professorTags = getInPersonProfessorTags(courseId)
  const firstLessonId = mockCourse?.modules?.[0]?.lessons?.[0]?.id ?? "demo"

  // Setup view variables combining API response and mocked fallbacks
  const title = course?.name || mockCourse?.title || "Curso Presencial"
  const description = course?.description || mockCourse?.description || ""
  const thumbnail = course?.thumbnailUrl || mockCourse?.thumbnail || "/placeholder.svg"
  
  const categoryLabel = course?.category === "FORMACAO" || mockCourse?.category === "FORMACAO" ? "Formação" : "Curso Livre"

  // Workload: Real if from API, otherwise mock in red
  const isDurationMocked = !course?.duration
  const durationText = course?.duration || meta?.duration || "Duração a definir"

  // Date rendering
  let eventDateText = ""
  let isDateMocked = false
  if (course?.details?.eventStartsAt) {
    const start = formatDate(course.details.eventStartsAt)
    const end = course.details.eventEndsAt ? formatDate(course.details.eventEndsAt) : null
    eventDateText = end ? `${start} até ${end}` : start
  } else if (meta?.date) {
    eventDateText = meta.date
    isDateMocked = true
  } else {
    eventDateText = "Data a confirmar"
    isDateMocked = true
  }

  // Venue rendering
  let eventVenueText = ""
  let isVenueMocked = false
  if (course?.details?.establishmentName) {
    const details = course.details
    const addr = [details.addressStreet, details.addressCity, details.addressState].filter(Boolean).join(", ")
    eventVenueText = addr ? `${details.establishmentName} (${addr})` : (details.establishmentName || "")
  } else if (meta?.venue) {
    eventVenueText = meta.venue
    isVenueMocked = true
  } else {
    eventVenueText = "Local a confirmar"
    isVenueMocked = true
  }

  return (
    <>
      <AppNavbar title="Cursos presenciais" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/courses?type=in-person"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>

        {isFallback && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">⚠️ Modo Fallback (Dados Locais Mockados)</p>
            <p className="mt-1">
              Este curso presencial não foi encontrado no banco de dados através da API. Exibindo dados locais com campos não suportados pelo contrato destacados em vermelho.
            </p>
          </div>
        )}

        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              Cursos presenciais ({categoryLabel})
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {title}
            </h2>
            <ExpandableText text={description} />

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {/* Date */}
              <div className={`flex items-center gap-2 ${isDateMocked ? "text-red-500" : "text-foreground"}`}>
                <CalendarDays className={`h-4 w-4 ${isDateMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventDateText} {isDateMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>
              
              {/* Venue */}
              <div className={`flex items-center gap-2 ${isVenueMocked ? "text-red-500" : "text-foreground"}`}>
                <MapPin className={`h-4 w-4 ${isVenueMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventVenueText} {isVenueMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-fit bg-red-600 hover:bg-red-700 text-white">
              <Link href={`/in-person-courses/${courseId}/lesson/${firstLessonId}`}>
                <PlayCircle className="h-4 w-4" />
                Assistir vídeo DEMO <span className="text-xs ml-1 font-normal opacity-85">(Mock)</span>
              </Link>
            </Button>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-secondary/50">
            <Image
              src={thumbnail}
              alt={`Imagem representativa do curso ${title}`}
              fill
              priority
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
              style={{ objectPosition: meta?.heroPosition ?? "center" }}
            />
          </div>
        </section>

        {/* Real Links & Files from API Contract (Normal colors) */}
        {((course?.links && course.links.length > 0) || (course?.files && course.files.length > 0)) && (
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Materiais de Apoio e Links do Curso
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Files */}
              {course.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4 transition-all hover:border-accent/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{file.title}</p>
                    <p className="text-xs text-muted-foreground">Arquivo para Download</p>
                  </div>
                  <Button size="icon" variant="ghost" asChild>
                    <a href={`/api/files/download/${file.id}`} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
              {/* Links */}
              {course.links.map((lnk, idx) => (
                <a
                  key={idx}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4 transition-all hover:border-accent/40 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{lnk.title}</p>
                    <p className="truncate text-xs text-accent">{lnk.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Informações do curso <span className="text-sm font-normal text-red-500 font-sans">(Campos Mockados destacados em vermelho)</span>
          </h3>
          <Accordion
            type={"multiple" as const}
            defaultValue={["area", "professores", "duracao", "metodologia"]}
            className="flex flex-col gap-3"
          >
            {/* Area: Mocked in red */}
            <AccordionItem value="area" className="overflow-hidden rounded-xl border border-red-200 bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline text-red-500">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-red-500">
                      Matéria / Área do direito <span className="text-xs font-normal opacity-85">(Mock)</span>
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-red-500 font-medium">
                  {meta?.area ?? "A definir"} <span className="text-xs font-normal opacity-85">(Mock)</span>
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Professors: Real if instructor exists, otherwise Mocked in red */}
            <AccordionItem
              value="professores"
              className={`overflow-hidden rounded-xl border bg-card ${instructor ? "border-border" : "border-red-200"}`}
            >
              <AccordionTrigger className={`px-4 py-3 hover:no-underline ${instructor ? "text-foreground" : "text-red-500"}`}>
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${instructor ? "bg-primary text-primary-foreground" : "bg-red-500 text-white"}`}>
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold">
                      Professores {!instructor && <span className="text-xs font-normal opacity-85">(Mock)</span>}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {instructor ? (
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/10 p-4">
                    {instructor.profileImageUrl ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-card">
                        <Image
                          src={instructor.profileImageUrl}
                          alt={instructor.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Users className="h-8 w-8" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-heading text-base font-semibold text-foreground">{instructor.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{instructor.description || "Professor principal do curso."}</p>
                    </div>
                  </div>
                ) : professorTags?.length ? (
                  <div className="flex flex-col gap-3 border border-red-100 p-3 rounded-lg bg-red-50/10">
                    {professorTags.map((professor) => (
                      <ProfessorTagCard
                        key={`${professor.name}-${professor.imageSrc}`}
                        professor={professor}
                      />
                    ))}
                    <p className="text-[10px] text-red-400 text-right font-medium">(Professores Mockados em vermelho)</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 text-sm text-red-500 font-medium">
                    {(meta?.professors?.length ? meta.professors : ["A definir"]).map((professor) => (
                      <li key={professor}>{professor} <span className="text-xs font-normal opacity-85">(Mock)</span></li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Duration: Real if from API, otherwise Mocked in red */}
            <AccordionItem value="duracao" className={`overflow-hidden rounded-xl border bg-card ${isDurationMocked ? "border-red-200" : "border-border"}`}>
              <AccordionTrigger className={`px-4 py-3 hover:no-underline ${isDurationMocked ? "text-red-500" : "text-foreground"}`}>
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDurationMocked ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}>
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold">
                      Duração {isDurationMocked && <span className="text-xs font-normal opacity-85 text-red-400">(Mock)</span>}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className={`text-sm leading-relaxed ${isDurationMocked ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                  {durationText} {isDurationMocked && <span className="text-xs font-normal opacity-85">(Mock)</span>}
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Methodology: Mocked in red */}
            <AccordionItem value="metodologia" className="overflow-hidden rounded-xl border border-red-200 bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline text-red-500">
                <div className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-red-500">
                      Metodologia / Módulos <span className="text-xs font-normal opacity-85">(Mock)</span>
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="flex flex-col gap-2 text-sm text-red-500 font-medium">
                  {(meta?.methodology?.length ? meta.methodology : ["Conteúdo em definição"]).map((item) => (
                    <li key={item} className="whitespace-pre-line leading-relaxed text-red-500">
                      {item} <span className="text-xs font-normal opacity-85">(Mock)</span>
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
