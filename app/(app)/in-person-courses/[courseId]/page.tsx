"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Link as LinkIcon,
  Download,
  FileText,
  Coins,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { ExpandableText } from "@/components/expandable-text"
import { ProfessorTagCard } from "@/components/professor-tag-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { getInPersonProfessorTags } from "@/lib/in-person-professor-tags"
import { getInPersonCourse, inPersonCourses } from "@/lib/mock-data"
import { getCourseById } from "@/services/courses/coursesService"
import { checkCourseAccess } from "@/services/enrollments/enrollmentsService"
import { useAuthStore } from "@/stores/authStore"
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

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

export default function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const [course, setCourse] = useState<CourseDetailResponse | null>(null)
  const [mockCourse, setMockCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        // Fetch from API contract GET /courses/{id}
        const data = await getCourseById(courseId)
        setCourse(data)

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

  useEffect(() => {
    async function verifyEnrollment() {
      if (!isAuthenticated) return
      try {
        const access = await checkCourseAccess(courseId)
        const enrolled = access.status === "ATIVA" || access.status === "CONCLUIDA" || access.status === "PENDENTE"
        setIsEnrolled(enrolled)
      } catch (error) {
        console.error("Failed to check course enrollment access:", error)
      }
    }

    verifyEnrollment()
  }, [courseId, isAuthenticated])

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

  // Registration rendering
  let registrationText = ""
  let isRegistrationMocked = false
  if (course?.details?.registrationStartsAt) {
    const start = formatShortDate(course.details.registrationStartsAt)
    const end = course.details.registrationEndsAt ? formatShortDate(course.details.registrationEndsAt) : null
    registrationText = end ? `De ${start} até ${end}` : `A partir de ${start}`
  } else {
    registrationText = "Período de inscrições a confirmar"
    isRegistrationMocked = true
  }

  // Price rendering
  let priceText = "A confirmar"
  let isPriceMocked = false
  if (course?.price !== undefined && course?.price !== null) {
    priceText = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(course.price)
  } else {
    priceText = "A confirmar"
    isPriceMocked = true
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
              Cursos presenciais
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {title}
            </h2>
            <ExpandableText text={description} />

            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              {/* Date */}
              <div className={`flex items-center gap-2 ${isDateMocked ? "text-red-500" : "text-foreground"}`}>
                <CalendarDays className={`h-4 w-4 ${isDateMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventDateText} {isDateMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              <div className={`flex items-center gap-2 ${isVenueMocked ? "text-red-500" : "text-foreground"}`}>
                <MapPin className={`h-4 w-4 ${isVenueMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventVenueText} {isVenueMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              {/* Registration Period */}
              <div className={`flex items-center gap-2 ${isRegistrationMocked ? "text-red-500" : "text-foreground"}`}>
                <CalendarDays className={`h-4 w-4 ${isRegistrationMocked ? "text-red-500" : "text-accent"}`} />
                <span>Período de inscrição: {registrationText} {isRegistrationMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              {/* Duration */}
              <div className={`flex items-center gap-2 ${isDurationMocked ? "text-red-500" : "text-foreground"}`}>
                <Clock3 className={`h-4 w-4 ${isDurationMocked ? "text-red-500" : "text-accent"}`} />
                <span>Duração: {durationText} {isDurationMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Investimento</span>
                <span className={`text-2xl font-bold ${isPriceMocked ? "text-red-500" : "text-foreground"}`}>
                  {priceText}
                </span>
              </div>
              <Button size="lg" className="px-8" disabled={isEnrolled}>
                {isEnrolled ? "Inscrito" : "Inscrever-se"}
              </Button>
            </div>
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
            Informações do curso
          </h3>
          <div className="flex flex-col gap-4">
            {/* Professors: Real if instructors exist, otherwise Mocked in red */}
            <div
              className={`overflow-hidden rounded-xl border bg-card p-4 ${(course?.instructors && course.instructors.length > 0) ? "border-border" : "border-red-200"}`}
            >
              <div className="flex items-center gap-3 border-b border-dashed pb-3 mb-3 border-border">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${(course?.instructors && course.instructors.length > 0) ? "bg-primary text-primary-foreground" : "bg-red-500 text-white"}`}>
                  <Users className="h-4 w-4" />
                </span>
                <p className={`font-heading text-sm font-semibold ${(course?.instructors && course.instructors.length > 0) ? "text-foreground" : "text-red-500"}`}>
                  Professor(es) {!(course?.instructors && course.instructors.length > 0) && <span className="text-xs font-normal opacity-85">(Mock)</span>}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {course?.instructors && course.instructors.length > 0 ? (
                  course.instructors.map((inst) => (
                    <div key={inst.id} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/10 p-4">
                      {inst.profileImageUrl ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-card">
                          <Image
                            src={inst.profileImageUrl}
                            alt={inst.name}
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
                        <p className="font-heading text-base font-semibold text-foreground">{inst.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{inst.description || "Professor principal do curso."}</p>
                      </div>
                    </div>
                  ))
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
