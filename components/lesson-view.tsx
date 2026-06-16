"use client"

import { useState } from "react"
import Link from "next/link"
import {
  PlayCircle,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  Play,
  ListVideo,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Course, Lesson } from "@/lib/mock-data"

const materials = [
  { name: "Slides da aula.pdf", size: "2.4 MB" },
  { name: "Modelo de petição.docx", size: "180 KB" },
  { name: "Jurisprudência comentada.pdf", size: "1.1 MB" },
]

export function LessonView({
  course,
  current,
  prev,
  next,
}: {
  course: Course
  current: { lesson: Lesson; moduleTitle: string }
  prev?: { lesson: Lesson; moduleTitle: string }
  next?: { lesson: Lesson; moduleTitle: string }
}) {
  const [playing, setPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const completed = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  )
  const progress = Math.round((completed / course.totalLessons) * 100)

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col">
        {/* Player */}
        <div className="relative aspect-video w-full bg-primary">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary-foreground">
            {playing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                  <span className="flex h-3 w-3 animate-ping rounded-full bg-gold" />
                </div>
                <p className="text-sm text-primary-foreground/70">Reproduzindo aula...</p>
              </div>
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group flex flex-col items-center gap-3"
                aria-label="Reproduzir aula"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform group-hover:scale-105">
                  <Play className="h-8 w-8 fill-current" />
                </span>
                <span className="text-sm text-primary-foreground/70">Assistir aula</span>
              </button>
            )}
          </div>
          <span className="absolute bottom-4 left-4 rounded bg-background/20 px-2 py-1 text-xs text-primary-foreground backdrop-blur">
            {current.lesson.duration}
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-background/20 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur lg:hidden"
          >
            <ListVideo className="h-4 w-4" />
            Aulas
          </button>
        </div>

        {/* Detalhes */}
        <div className="flex flex-col gap-6 p-4 md:p-6">
          <div>
            <p className="text-xs font-medium text-accent">{current.moduleTitle}</p>
            <h1 className="mt-1 font-heading text-xl font-bold text-foreground md:text-2xl">
              {current.lesson.title}
            </h1>
          </div>

          {/* Navegação entre aulas */}
          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/cursos/${course.id}/aula/${prev.lesson.id}`}>
                  <ChevronLeft className="h-4 w-4" />
                  Aula anterior
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button asChild size="sm">
                <Link href={`/cursos/${course.id}/aula/${next.lesson.id}`}>
                  Próxima aula
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href={`/cursos/${course.id}`}>Concluir módulo</Link>
              </Button>
            )}
          </div>

          <section>
            <h2 className="font-heading text-base font-semibold text-foreground">Descrição</h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {current.lesson.description}
            </p>
          </section>

          {/* Material complementar */}
          <section>
            <h2 className="font-heading text-base font-semibold text-foreground">
              Material complementar
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {materials.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.size}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Baixar ${m.name}`}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar de aulas */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border bg-card transition-transform lg:static lg:z-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">Conteúdo do curso</p>
            <p className="text-xs text-muted-foreground">
              {completed}/{course.totalLessons} aulas concluídas
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground lg:hidden"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-border px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.modules.map((mod, i) => (
            <div key={mod.id} className="border-b border-border last:border-0">
              <div className="bg-secondary/50 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Módulo {i + 1}
                </p>
                <p className="text-sm font-medium text-foreground">{mod.title}</p>
              </div>
              <ul>
                {mod.lessons.map((lesson) => {
                  const active = lesson.id === current.lesson.id
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/cursos/${course.id}/aula/${lesson.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          active
                            ? "border-l-2 border-accent bg-accent/5 font-medium text-accent"
                            : "text-foreground hover:bg-secondary",
                        )}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <PlayCircle
                            className={cn(
                              "h-4 w-4 shrink-0",
                              active ? "text-accent" : "text-muted-foreground",
                            )}
                          />
                        )}
                        <span className="flex-1 leading-snug">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </Link>
                    </li>
                  )
                })}
                {mod.exam && (
                  <li>
                    <Link
                      href={`/cursos/${course.id}/prova/${mod.exam.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <FileDown className="h-4 w-4 shrink-0 text-gold-foreground" />
                      <span className="flex-1 leading-snug font-medium">{mod.exam.title}</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
