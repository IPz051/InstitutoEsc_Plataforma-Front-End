"use client"

import { useEffect, useMemo, useState } from "react"
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
  MessageSquare,
  X,
} from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { ProfessorCardsSection } from "@/components/professor-cards-section"
import type { ProfessorTag } from "@/components/professor-tag-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Course, Lesson } from "@/lib/mock-data"

const materials = [
  { name: "Slides da aula.pdf", size: "2.4 MB" },
  { name: "Modelo de petição.docx", size: "180 KB" },
  { name: "Jurisprudência comentada.pdf", size: "1.1 MB" },
]

type LessonQuestion = {
  id: string
  text: string
  createdAt: string
}

export function LessonView({
  course,
  current,
  prev,
  next,
  basePath = "/courses",
  professorTags,
}: {
  course: Course
  current: { lesson: Lesson; moduleTitle: string }
  prev?: { lesson: Lesson; moduleTitle: string }
  next?: { lesson: Lesson; moduleTitle: string }
  basePath?: string
  professorTags?: ProfessorTag[]
}) {
  const t = useTranslations()
  const format = useFormatter()
  const [playing, setPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [questionSent, setQuestionSent] = useState(false)
  const [questionHistory, setQuestionHistory] = useState<LessonQuestion[]>([])

  const completed = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  )
  const progress = Math.round((completed / course.totalLessons) * 100)
  const storageKey = useMemo(
    () => `lesson-questions:${basePath}:${course.id}:${current.lesson.id}`,
    [basePath, course.id, current.lesson.id],
  )

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      setQuestionHistory(saved ? (JSON.parse(saved) as LessonQuestion[]) : [])
    } catch {
      setQuestionHistory([])
    }
    setQuestion("")
    setQuestionSent(false)
  }, [storageKey])

  function handleQuestionSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!question.trim()) return

    const nextQuestion: LessonQuestion = {
      id: `${Date.now()}`,
      text: question.trim(),
      createdAt: format.dateTime(new Date(), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    const updatedHistory = [nextQuestion, ...questionHistory]
    setQuestionHistory(updatedHistory)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(updatedHistory))
    } catch {
      // Ignore storage errors and keep the in-memory state.
    }
    setQuestionSent(true)
    setQuestion("")
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col">
        {/* Player */}
        <div className="relative aspect-video w-full bg-primary">
          {playing ? (
            current.lesson.videoUrl ? (
              <video
                className="absolute inset-0 h-full w-full"
                controls
                autoPlay
                playsInline
                src={current.lesson.videoUrl}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary-foreground">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                    <span className="flex h-3 w-3 animate-ping rounded-full bg-gold" />
                  </div>
                  <p className="text-sm text-primary-foreground/70">{t("lesson.playing")}</p>
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary-foreground">
              <button
                onClick={() => setPlaying(true)}
                className="group flex flex-col items-center gap-3"
                aria-label={t("lesson.ariaPlay")}
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform group-hover:scale-105">
                  <Play className="h-8 w-8 fill-current" />
                </span>
                <span className="text-sm text-primary-foreground/70">{t("lesson.playLabel")}</span>
              </button>
            </div>
          )}
          <span className="absolute bottom-4 left-4 rounded bg-background/20 px-2 py-1 text-xs text-primary-foreground backdrop-blur">
            {current.lesson.duration}
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-background/20 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur lg:hidden"
          >
            <ListVideo className="h-4 w-4" />
            {t("lesson.lessonsLabel")}
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
                <Link href={`${basePath}/${course.id}/lesson/${prev.lesson.id}`}>
                  <ChevronLeft className="h-4 w-4" />
                  {t("lesson.previousLesson")}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button asChild size="sm">
                <Link href={`${basePath}/${course.id}/lesson/${next.lesson.id}`}>
                  {t("lesson.nextLesson")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </div>
            {/* Pg */}
          <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-base font-semibold text-foreground">
                {t("lesson.questions")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("lesson.questionsSubtitle")}
              </p>
            </div>

            <form onSubmit={handleQuestionSubmit} className="mt-4 flex flex-col gap-3">
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value)
                  if (questionSent) setQuestionSent(false)
                }}
                placeholder={t("lesson.questionPlaceholder")}
                rows={4}
                className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {t("lesson.questionLinked")}
                </p>
                <Button type="submit" size="sm" disabled={!question.trim()}>
                  {t("lesson.submitQuestion")}
                </Button>
              </div>

              {questionSent ? (
                <div className="rounded-xl bg-secondary px-3 py-2 text-sm text-foreground">
                  {t("lesson.questionSentMsg")}
                </div>
              ) : null}
            </form>

            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {t("lesson.questionHistory")}
                </h3>
              </div>

              {questionHistory.length ? (
                <div className="mt-3 flex flex-col gap-3">
                  {questionHistory.map((item) => (
                    <div key={item.id} className="rounded-xl bg-secondary/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{t("lesson.questionSentLabel")}</p>
                        <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                  {t("lesson.noQuestions")}
                </div>
              )}
            </div>
          </section>

          {/* Material complementar */}
          <section>
            <h2 className="font-heading text-base font-semibold text-foreground">
              {t("lesson.materials")}
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
                  <Button variant="ghost" size="icon" aria-label={t("lesson.downloadLabel", { name: m.name })}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {professorTags?.length ? <ProfessorCardsSection professors={professorTags} /> : null}
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
            <p className="font-heading text-sm font-semibold text-foreground">{t("lesson.courseContent")}</p>
            <p className="text-xs text-muted-foreground">
              {t("lesson.lessonsCompleted", { completed, total: course.totalLessons })}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground lg:hidden"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-border px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("lesson.progressLabel")}</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.modules.map((mod, i) => (
            <div key={mod.id} className="border-b border-border last:border-0">
              <div className="bg-secondary/50 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("lesson.moduleLabel", { number: i + 1 })}
                </p>
                <p className="text-sm font-medium text-foreground">{mod.title}</p>
              </div>
              <ul>
                {mod.lessons.map((lesson) => {
                  const active = lesson.id === current.lesson.id
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`${basePath}/${course.id}/lesson/${lesson.id}`}
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
                      href={`${basePath}/${course.id}/exam/${mod.exam.id}`}
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
