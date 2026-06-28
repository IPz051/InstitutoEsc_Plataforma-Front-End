"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
  MapPin,
  Users,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppNavbar } from "@/components/app-navbar"
import { CourseCard } from "@/components/course-card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { InPersonCourse } from "@/lib/mock-data"
import { listCourses } from "@/services/courses/coursesService"
import type { CourseSummary } from "@/types"

type Tab = "free" | "in-person"

function getTabFromSearchParams(selectedTab: string | null): Tab {
  return selectedTab === "in-person" ? "in-person" : "free"
}

function formatInPersonCourse(course: CourseSummary): InPersonCourse {
  return {
    id: course.id,
    title: course.name,
    thumbnail: course.thumbnailUrl || "/placeholder.svg",
    city: "",
    state: "",
    venue: "",
    date: "",
    month: "",
    year: "",
    status: "in-progress",
    track: course.category === "FORMACAO" ? "Formação" : "Curso Livre",
    availableLabel: "Inscrições abertas",
    completedLessons: 0,
    totalLessons: 0,
    progress: 0,
  }
}

function formatOnlineCourse(course: CourseSummary) {
  return {
    id: course.id,
    title: course.name,
    shortDescription: course.description || "",
    category: course.category === "FORMACAO" ? "Formação" : "Curso Livre",
    thumbnail: course.thumbnailUrl || "/placeholder.svg",
    status: "not-started" as const,
    progress: 0,
    totalLessons: 0,
    workload: "",
  }
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesPageFallback />}>
      <CoursesPageContent />
    </Suspense>
  )
}

function CoursesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => getTabFromSearchParams(searchParams.get("type")))
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setTab(getTabFromSearchParams(searchParams.get("type")))
  }, [searchParams])

  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab)
    setPage(0)
    const params = new URLSearchParams(searchParams.toString())
    params.set("type", nextTab)
    router.replace(`/courses?${params.toString()}`)
  }

  const handlePrevPage = () => {
    setPage((p) => {
      const prev = p - 1
      return prev >= 0 ? prev : 0
    })
  }

  const handleNextPage = () => {
    setPage((p) => {
      const next = p + 1
      return next < totalPages ? next : p
    })
  }

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      try {
        const typeParam = tab === "free" ? "ONLINE" : "IN_PERSON"
        // 3 items per page as requested: "coloque 3 itens por paginação"
        const data = await listCourses({ type: typeParam, page, size: 3 })
        if (!active) return

        setCourses(data.content || [])
        setTotalPages(typeof data.totalPages === "number" ? Math.max(1, data.totalPages) : 1)
      } catch (error) {
        console.error("Failed to load courses:", error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [tab, page])

  return (
    <>
      <AppNavbar title="Cursos" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-[#e7ecff]">
          <button
            type="button"
            onClick={() => handleTabChange("free")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "free"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Layers className="h-4 w-4" />
            Cursos Online
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("in-person")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "in-person"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Cursos Presenciais
          </button>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-72 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff] animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Página {page + 1} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page <= 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {tab === "free" ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, idx) => (
                  <CourseCard
                    key={course.id}
                    course={formatOnlineCourse(course)}
                    basePath="/courses"
                    priority={idx < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, idx) => (
                  <InPersonCourseCard
                    key={course.id}
                    course={formatInPersonCourse(course)}
                    priority={idx < 3}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-medium text-foreground">Nenhum curso encontrado</p>
            <p className="text-sm text-muted-foreground">
              Não há cursos nesta categoria no momento.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function CoursesPageFallback() {
  return (
    <>
      <AppNavbar title="Cursos" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="h-13 rounded-full bg-white shadow-sm ring-1 ring-[#e7ecff]" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
          ))}
        </div>
      </div>
    </>
  )
}

function InPersonCourseCard({ course, priority = false }: { course: InPersonCourse; priority?: boolean }) {
  const isAvailable = course.status === "in-progress"

  return (
    <Link
      href={`/in-person-courses/${course.id}`}
      className="block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff] transition-all hover:shadow-md"
    >
      <div className="relative border-b border-dashed border-[#cfd8ff] bg-[#fbfcff]">
        <div className="absolute left-4 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-primary ring-1 ring-[#e7ecff]">
          {isAvailable ? "Em andamento" : "Em breve"}
        </div>
        <div className="relative h-30 overflow-hidden border-x border-dashed border-[#cfd8ff]">
          <Image
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover"
            priority={priority}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {course.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {course.city}-{course.state}
            </span>
          )}
          {course.month && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {course.month} {course.year}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-heading text-[1.35rem] font-semibold leading-tight text-foreground">
            {course.title}
          </h3>
          {(course.track || course.city) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {course.track} {course.city ? `• ${course.city}-${course.state}` : ""}
            </p>
          )}
          {course.date && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Data:</span> {course.date}
            </p>
          )}
          {course.venue && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Local:</span> {course.venue}
            </p>
          )}
        </div>

        {isAvailable ? (
          <div className="pt-1">
            {course.totalLessons ? (
              <>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">&nbsp;</span>
                  <span className="font-medium text-muted-foreground">
                    {`${course.completedLessons ?? 0}/${course.totalLessons ?? 0} aulas`}
                  </span>
                </div>
                <Progress value={course.progress ?? 0} className="h-1.5" />
              </>
            ) : null}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 pt-1 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            {course.availableLabel}
          </div>
        )}
      </div>
    </Link>
  )
}
