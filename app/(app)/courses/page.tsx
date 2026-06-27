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
import { freeCourses, inPersonCourses, type InPersonCourse } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Filter = "todos" | "em-andamento" | "concluido"
type Tab = "livres" | "presenciais"

const filters: { id: Filter; label: string }[] = [
  { id: "em-andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluídos" },
  { id: "todos", label: "Todos" },
]

const ITEMS_PER_PAGE = 3

function getTabFromSearchParams(selectedTab: string | null): Tab {
  return selectedTab === "presenciais" ? "presenciais" : "livres"
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
  const [tab, setTab] = useState<Tab>(() => getTabFromSearchParams(searchParams.get("tipo")))
  const [filter, setFilter] = useState<Filter>("todos")
  const [page, setPage] = useState(0)

  useEffect(() => {
    setTab(getTabFromSearchParams(searchParams.get("tipo")))
  }, [searchParams])

  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tipo", nextTab)
    router.replace(`/cursos?${params.toString()}`)
  }

  const filtered = freeCourses.filter((c) => {
    if (filter === "todos") return true
    return c.status === filter
  })

  const pages: typeof filtered[] = []
  for (let i = 0; i < filtered.length; i += ITEMS_PER_PAGE) {
    pages.push(filtered.slice(i, i + ITEMS_PER_PAGE))
  }

  useEffect(() => {
    setPage(0)
  }, [filter, tab])

  useEffect(() => {
    if (pages.length === 0) {
      if (page !== 0) setPage(0)
      return
    }
    if (page > pages.length - 1) setPage(pages.length - 1)
  }, [page, pages.length])

  return (
    <>
      <AppNavbar title="Cursos" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-[#e7ecff]">
          <button
            type="button"
            onClick={() => handleTabChange("livres")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "livres"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Layers className="h-4 w-4" />
            Cursos Livres
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("presenciais")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "presenciais"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Cursos Presenciais
          </button>
        </div>

        {tab === "livres" ? (
          <>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const count =
                  f.id === "todos"
                    ? freeCourses.length
                    : freeCourses.filter((c) => c.status === f.id).length
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      filter === f.id
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-xs",
                        filter === f.id ? "bg-accent-foreground/20" : "bg-secondary",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {pages.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {page + 1} / {pages.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
                      disabled={page === pages.length - 1}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Próximo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${page * 100}%)` }}
                  >
                    {pages.map((group, index) => (
                      <div key={index} className="w-full shrink-0">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {group.map((course) => (
                            <CourseCard key={course.id} course={course} basePath="/cursos" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <p className="font-medium text-foreground">Nenhum curso encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Não há cursos nesta categoria no momento.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {inPersonCourses.map((course) => (
              <InPersonCourseCard key={course.id} course={course} />
            ))}
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

function InPersonCourseCard({ course }: { course: InPersonCourse }) {
  const isAvailable = course.status === "em-andamento"

  return (
    <Link
      href={`/cursos-presenciais/${course.id}`}
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
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {course.city}-{course.state}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {course.month} {course.year}
          </span>
        </div>

        <div>
          <h3 className="font-heading text-[1.35rem] font-semibold leading-tight text-foreground">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.track} • {course.city}-{course.state}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Data:</span> {course.date}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Local:</span> {course.local}
          </p>
        </div>

        {isAvailable ? (
          <div className="pt-1">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">&nbsp;</span>
              <span className="font-medium text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} aulas
              </span>
            </div>
            <Progress value={course.progress ?? 0} className="h-1.5" />
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
