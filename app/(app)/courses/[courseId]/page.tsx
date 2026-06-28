"use client"

import { use, useEffect, useState } from "react"
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
  Link as LinkIcon,
  Download,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFreeCourse } from "@/lib/mock-data"
import { getCourseById } from "@/services/courses/coursesService"
import type { CourseDetailResponse } from "@/types"

export default function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const [course, setCourse] = useState<CourseDetailResponse | null>(null)
  const [mockCourse, setMockCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        // Call the API endpoint GET /courses/{id} from the contract
        const data = await getCourseById(courseId)
        setCourse(data)
        
        // Also fetch local mock data to combine modules/lessons if available
        const localMock = getFreeCourse(courseId)
        if (localMock) {
          setMockCourse(localMock)
        }
        setIsFallback(false)
      } catch (error) {
        console.warn(`API call failed for courseId ${courseId}, trying fallback:`, error)
        const localMock = getFreeCourse(courseId)
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
        <AppNavbar title="Curso" />
        <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
          <div className="h-6 w-32 rounded bg-muted/20" />
          <div className="h-48 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
          <div className="h-10 w-48 rounded bg-muted/20" />
          <div className="h-32 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
        </div>
      </>
    )
  }

  // If no course was found in API and fallback also failed
  if (!course && !mockCourse) {
    notFound()
  }

  // Define fallback modules if none are available in the mock data
  const defaultMockModules = [
    {
      id: "mock-m1",
      title: "Módulo 1: Fundamentos Iniciais",
      lessons: [
        { id: "mock-l1", title: "Aula 1: Apresentação Geral", duration: "15 min", completed: true },
        { id: "mock-l2", title: "Aula 2: Conceitos Chave", duration: "20 min", completed: false },
      ],
      exam: {
        id: "mock-e1",
        title: "Prova do Módulo 1",
        passed: false,
      }
    },
    {
      id: "mock-m2",
      title: "Módulo 2: Aprofundamento Prático",
      lessons: [
        { id: "mock-l3", title: "Aula 3: Primeiros Passos e Prática", duration: "25 min", completed: false },
        { id: "mock-l4", title: "Aula 4: Estudo de Caso Real", duration: "30 min", completed: false },
      ],
      exam: {
        id: "mock-e2",
        title: "Prova de Certificação",
        passed: false,
      }
    },
  ]

  // Setup view variables combining API response and mocked fallbacks
  const title = course?.name || mockCourse?.title || "Curso"
  const categoryLabel = course?.category === "FORMACAO" || mockCourse?.category === "FORMACAO" ? "Formação" : "Curso Livre"
  
  const description = course ? course.description : mockCourse?.description
  const duration = course ? course.duration : mockCourse?.workload

  const professor = mockCourse?.professor || "Instituto ESC"
  const professorRole = mockCourse?.professorRole || "Curso Livre"

  const modulesToUse = mockCourse?.modules || defaultMockModules
  const lessonsToUse = modulesToUse.flatMap((m: any) => m.lessons)
  const examsToUse = modulesToUse.map((m: any) => m.exam).filter(Boolean)

  const totalLessons = mockCourse?.totalLessons || lessonsToUse.length
  const completedLessonsCount = lessonsToUse.filter((l: any) => l.completed).length
  const progress = mockCourse?.progress !== undefined ? mockCourse.progress : (totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0)

  const firstUnfinished = lessonsToUse.find((l: any) => !l.completed) ?? lessonsToUse[0]

  return (
    <>
      <AppNavbar title={title} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/courses?type=free"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos Online
        </Link>

        {isFallback && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">⚠️ Modo Fallback (Dados Locais Mockados)</p>
            <p className="mt-1">
              Este curso não foi encontrado no banco de dados através da API. Exibindo dados locais com campos não suportados pelo contrato destacados em vermelho.
            </p>
          </div>
        )}

        {/* Hero do curso */}
        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              {categoryLabel}
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {title}
            </h2>
            <div className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="text-red-500 font-medium">Descrição do curso não disponível no banco de dados (Mock)</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {/* Professor: Mocked in red */}
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-red-500" />
                <div className="leading-tight">
                  <p className="font-medium text-red-500">{professor} <span className="text-xs font-normal">(Mock)</span></p>
                  <p className="text-xs text-red-400">{professorRole} <span className="text-[10px] font-normal">(Mock)</span></p>
                </div>
              </div>
              
              {/* Workload: Real if from API, otherwise Mocked in red */}
              {duration ? (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>{duration}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>10 horas (Mock)</span>
                </div>
              )}

              {/* Total Lessons: Mocked in red */}
              <div className="flex items-center gap-2 text-red-500">
                <BookOpen className="h-4 w-4 text-red-500" />
                <span>{`${totalLessons} aulas`} <span className="text-xs">(Mock)</span></span>
              </div>
            </div>

            {firstUnfinished && (
              <Button asChild size="lg" className="mt-6 w-fit bg-red-600 hover:bg-red-700 text-white">
                <Link href={`/courses/${courseId}/lesson/${firstUnfinished.id}`}>
                  <PlayCircle className="h-4 w-4" />
                  {progress > 0 ? "Continuar curso (Mock)" : "Começar curso (Mock)"}
                </Link>
              </Button>
            )}
          </div>

          {/* Progress Section: Mocked in red */}
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-red-50/20 border border-red-200/20 p-6">
            <ProgressRing
              value={progress}
              sublabel="concluído (Mock)"
              strokeClass="stroke-red-500"
              labelClass="text-red-500"
              sublabelClass="text-red-400"
            />
            <p className="text-center text-sm text-red-500">
              {`${completedLessonsCount} de ${totalLessons} aulas concluídas (Mock)`}
            </p>
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

        {/* Conteúdo / Aulas: Mocked in red */}
        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Aulas do curso <span className="text-sm font-normal text-red-500 font-sans">(Aulas Mockadas em vermelho)</span>
          </h3>
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-card p-4">
            <ul className="flex flex-col gap-1">
              {lessonsToUse.map((lesson: any, index: number) => (
                <li key={lesson.id} className="border-b border-red-100/35 last:border-0 last:pb-0 pb-1">
                  <Link
                    href={`/courses/${courseId}/lesson/${lesson.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-red-50/10"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
                    ) : (
                      <PlayCircle className="h-5 w-5 shrink-0 text-red-400" />
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-red-500">{lesson.title} <span className="text-xs font-normal opacity-85">(Mock)</span></p>
                      {lesson.description && (
                        <p className="text-xs text-red-400/80 mt-0.5 line-clamp-1">{lesson.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-red-400 shrink-0">{lesson.duration} <span className="text-[10px] font-normal opacity-85">(Mock)</span></span>
                  </Link>
                </li>
              ))}
              
              {/* Exams list */}
              {examsToUse.map((exam: any) => (
                <li key={exam.id} className="border-t border-dashed border-red-200 pt-2 mt-1">
                  <Link
                    href={`/courses/${courseId}/exam/${exam.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-red-50/10"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600">
                      {exam.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-red-500" />
                      ) : (
                        <FileText className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="flex-1 text-sm font-medium text-red-500">
                      {exam.title} <span className="text-xs font-normal opacity-85">(Mock)</span>
                    </span>
                    {exam.passed ? (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-xs text-red-500"
                      >
                        Aprovado (Mock)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-200 text-xs text-red-500">
                        Prova (Mock)
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}

