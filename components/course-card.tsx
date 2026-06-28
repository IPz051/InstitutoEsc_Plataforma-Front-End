"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
export interface CourseCardData {
  id: string
  title: string
  shortDescription?: string | null
  category?: string
  thumbnail?: string | null
  status?: string | null
  progress?: number | null
  totalLessons?: number | null
  workload?: string | null
}

export function CourseCard({
  course,
  basePath = "/courses",
  priority = false,
}: {
  course: CourseCardData
  basePath?: string
  priority?: boolean
}) {
  const status = course.status || "not-started"
  const cta =
    status === "not-started"
      ? "Começar curso"
      : status === "completed"
        ? "Revisar curso"
        : "Continuar curso"

  const showLessons = typeof course.totalLessons === "number" && course.totalLessons > 0
  const showWorkload = !!course.workload
  const showProgress = typeof course.progress === "number" && course.progress >= 0

  return (
    <Link
      href={`${basePath}/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/40 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-primary">
        <Image
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {course.category && (
          <span className="text-xs font-medium text-accent">{course.category}</span>
        )}
        <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-foreground text-pretty">
          {course.title}
        </h3>
        {course.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {course.shortDescription}
          </p>
        )}

        {(showLessons || showWorkload) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            {showLessons && <span>{`${course.totalLessons} aulas`}</span>}
            {showLessons && showWorkload && <span aria-hidden>•</span>}
            {showWorkload && <span>{course.workload}</span>}
          </div>
        )}

        <div className="mt-auto pt-4">
          {showProgress && (
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold text-foreground">{course.progress}%</span>
            </div>
          )}
          {showProgress && <Progress value={course.progress || 0} className="mb-3" />}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
