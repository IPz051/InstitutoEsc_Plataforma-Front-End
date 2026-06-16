"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { CourseCard } from "@/components/course-card"
import { courses } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Filter = "todos" | "em-andamento" | "concluido"

const filters: { id: Filter; label: string }[] = [
  { id: "em-andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluídos" },
  { id: "todos", label: "Todos" },
]

const ITEMS_PER_PAGE = 3

export default function OnlineCoursesPage() {
  const [filter, setFilter] = useState<Filter>("todos")
  const [page, setPage] = useState(0)

  const filtered = courses.filter((course) => {
    if (filter === "todos") return true
    return course.status === filter
  })

  const pages: typeof filtered[] = []
  for (let index = 0; index < filtered.length; index += ITEMS_PER_PAGE) {
    pages.push(filtered.slice(index, index + ITEMS_PER_PAGE))
  }

  useEffect(() => {
    setPage(0)
  }, [filter])

  useEffect(() => {
    if (pages.length === 0) {
      if (page !== 0) setPage(0)
      return
    }
    if (page > pages.length - 1) setPage(pages.length - 1)
  }, [page, pages.length])

  return (
    <>
      <AppNavbar title="Formação Online" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Formação Online
          </h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe sua trilha principal de formação com conteúdos, aulas e avaliações.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => {
            const count =
              filterItem.id === "todos"
                ? courses.length
                : courses.filter((course) => course.status === filterItem.id).length
            return (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  filter === filterItem.id
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
                )}
              >
                {filterItem.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs",
                    filter === filterItem.id ? "bg-accent-foreground/20" : "bg-secondary",
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
                  onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                  disabled={page === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((currentPage) => Math.min(pages.length - 1, currentPage + 1))
                  }
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
                        <CourseCard
                          key={course.id}
                          course={course}
                          basePath="/formacao-online"
                        />
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
      </div>
    </>
  )
}
