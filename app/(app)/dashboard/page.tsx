import Link from "next/link"
import {
  Award,
  Play,
  CalendarDays,
  FileText,
  ArrowRight,
} from "lucide-react"
import { getFormatter, getTranslations } from "next-intl/server"
import { AppNavbar } from "@/components/app-navbar"
import { CourseCard } from "@/components/course-card"
import { ProgressRing } from "@/components/progress-ring"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  student,
  courses,
  certificates,
  calendarEvents,
} from "@/lib/mock-data"

export default async function DashboardPage() {
  const t = await getTranslations()
  const format = await getFormatter()
  const enrolled = courses.filter((c) => c.status !== "not-started")
  const inProgress = courses.filter((c) => c.status === "in-progress")
  const overall = Math.round(
    enrolled.reduce((acc, c) => acc + c.progress, 0) / enrolled.length,
  )
  const totalLessons = enrolled.reduce((acc, c) => acc + c.totalLessons, 0)
  const completedLessons = enrolled.reduce(
    (acc, c) => acc + Math.round((c.progress / 100) * c.totalLessons),
    0,
  )
  const issuedCerts = certificates.filter((c) => c.status === "issued")

  const exams = calendarEvents
    .filter((e) => e.type === "exam")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)
  const events = calendarEvents
    .filter((e) => e.type === "event" || e.type === "lesson")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  function formatDate(iso: string) {
    return format.dateTime(new Date(iso + "T00:00:00"), { day: "2-digit", month: "short" })
  }

  const resumeCourse = inProgress[0] ?? enrolled[0]

  return (
    <>
      <AppNavbar title={t("dashboard.title")} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-[#e7ecff] md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {t("dashboard.greeting", { name: student.firstName })}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-[#f6f8ff] px-4 py-3 ring-1 ring-[#e7ecff]">
            <ProgressRing value={overall} size={56} strokeWidth={8} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{t("dashboard.progressTitle")}</p>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.lessonsCompleted", { completed: completedLessons, total: totalLessons })}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-[#e7ecff]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {t("dashboard.continueLabel")}
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Play className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold text-foreground">
                  {resumeCourse?.title ?? t("dashboard.fallbackCourse")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t("dashboard.moduleLabel", { workload: resumeCourse?.workload ?? "—" })}
                </p>
              </div>
            </div>
            <Link
              href={resumeCourse ? `/online-training/${resumeCourse.id}` : "/online-training"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              {t("dashboard.continue")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progresso geral */}
          <Card className="lg:col-span-1 rounded-3xl ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="font-heading text-base">{t("dashboard.overallProgress")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ProgressRing value={overall} sublabel={t("dashboard.completedSublabel")} />
              <p className="text-center text-sm text-muted-foreground">
                {t("dashboard.averageCompletion", { count: enrolled.length })}
              </p>
            </CardContent>
          </Card>

          {/* Próximas provas */}
          <Card className="lg:col-span-1 rounded-3xl ring-1 ring-[#e7ecff]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <FileText className="h-4 w-4 text-accent" />
                {t("dashboard.upcomingExams")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-secondary text-center">
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {formatDate(exam.date).split(" ")[1]}
                    </span>
                    <span className="text-sm font-bold leading-none text-foreground">
                      {formatDate(exam.date).split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-sm leading-snug text-foreground">{exam.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Próximos eventos */}
          <Card className="lg:col-span-1 rounded-3xl ring-1 ring-[#e7ecff]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <CalendarDays className="h-4 w-4 text-accent" />
                {t("dashboard.upcomingEvents")}
              </CardTitle>
              <Link
                href="/calendar"
                className="text-xs font-medium text-accent hover:underline"
              >
                {t("dashboard.seeAll")}
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-secondary text-center">
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {formatDate(ev.date).split(" ")[1]}
                    </span>
                    <span className="text-sm font-bold leading-none text-foreground">
                      {formatDate(ev.date).split(" ")[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm leading-snug text-foreground">{ev.title}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] capitalize">
                      {ev.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cursos matriculados */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {t("dashboard.keepLearning")}
            </h3>
            <Link
              href="/online-training"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              {t("dashboard.seeAllCourses")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((course) => (
              <CourseCard key={course.id} course={course} basePath="/online-training" />
            ))}
          </div>
        </section>

        {/* Certificados conquistados */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {t("dashboard.earnedCertificates")}
            </h3>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              {t("dashboard.seeAllCerts")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {issuedCerts.map((cert) => (
              <Card key={cert.id} className="border-gold/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-foreground">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{cert.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("dashboard.issuedOn", { date: cert.issueDate, hours: cert.hours })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
