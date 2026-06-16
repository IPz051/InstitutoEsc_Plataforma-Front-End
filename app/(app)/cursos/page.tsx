"use client"

import { useState } from "react"
import {
  CalendarDays,
  ImageIcon,
  Layers,
  Lock,
  MapPin,
  Users,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { CourseCard } from "@/components/course-card"
import { Progress } from "@/components/ui/progress"
import { courses, inPersonCourses, type InPersonCourse } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Filter = "todos" | "em-andamento" | "concluido"
type Tab = "online" | "presenciais"

const filters: { id: Filter; label: string }[] = [
  { id: "em-andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluídos" },
  { id: "todos", label: "Todos" },
]

export default function CoursesPage() {
  const [tab, setTab] = useState<Tab>("online")
  const [filter, setFilter] = useState<Filter>("todos")

  const filtered = courses.filter((c) => {
    if (filter === "todos") return true
    return c.status === filter
  })

  return (
    <>
      <AppNavbar title="Meus Cursos" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-[#e7ecff]">
          <button
            type="button"
            onClick={() => setTab("online")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "online"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Layers className="h-4 w-4" />
            Formação online
          </button>
          <button
            type="button"
            onClick={() => setTab("presenciais")}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === "presenciais"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Cursos presenciais
          </button>
        </div>

        {tab === "online" ? (
          <>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const count =
                  f.id === "todos"
                    ? courses.length
                    : courses.filter((c) => c.status === f.id).length
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

            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
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

function InPersonCourseCard({ course }: { course: InPersonCourse }) {
  const isAvailable = course.status === "em-andamento"

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff] transition-all hover:shadow-md">
      <div className="relative border-b border-dashed border-[#cfd8ff] bg-[#fbfcff]">
        <div className="absolute left-4 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-primary ring-1 ring-[#e7ecff]">
          {isAvailable ? "Em andamento" : "Em breve"}
        </div>
        <div className="flex h-30 items-center justify-center border-x border-dashed border-[#cfd8ff]">
          <div className="flex flex-col items-center text-center text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
            <span className="mt-3 max-w-[180px] text-sm">{course.title}</span>
          </div>
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
    </div>
  )
}
