"use client"

import { useMemo, useState } from "react"
import { Calendar as CalendarIcon, Video, FileCheck, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calendarEvents, type CalendarEvent } from "@/lib/mock-data"

const typeConfig: Record<
  CalendarEvent["type"],
  { label: string; icon: typeof Video; className: string; dot: string }
> = {
  aula: {
    label: "Aula ao vivo",
    icon: Video,
    className: "bg-accent/10 text-accent border-accent/20",
    dot: "bg-accent",
  },
  prova: {
    label: "Avaliação",
    icon: FileCheck,
    className: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  evento: {
    label: "Evento",
    icon: Star,
    className: "bg-gold/15 text-gold-foreground border-gold/30",
    dot: "bg-gold",
  },
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function eventsForDay(year: number, month: number, day: number) {
  return calendarEvents.filter((e) => {
    const date = new Date(e.date + "T00:00:00")
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year
  })
}

export default function CalendarioPage() {
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2026)

  const monthLabel = useMemo(() => {
    const label = new Date(year, month, 1).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [month, year])

  const cells = useMemo(() => buildCalendarCells(year, month), [year, month])
  const sortedEvents = useMemo(
    () =>
      [...calendarEvents]
        .filter((e) => {
          const date = new Date(e.date + "T00:00:00")
          return date.getMonth() === month && date.getFullYear() === year
        })
        .sort((a, b) => a.date.localeCompare(b.date)),
    [month, year],
  )

  const today = useMemo(() => new Date(), [])

  const handlePrevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const handleNextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Calendário</h1>
        <p className="mt-1 text-muted-foreground">
          Acompanhe suas aulas ao vivo, avaliações e eventos da comunidade ESC.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle className="font-heading flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-accent" />
              {monthLabel}
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Mês anterior
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Próximo mês
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w) => (
                <div key={w} className="pb-2 text-xs font-semibold uppercase text-muted-foreground">
                  {w}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="aspect-square" />
                const dayEvents = eventsForDay(year, month, day)
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                return (
                  <div
                    key={day}
                    className={`flex aspect-square flex-col items-center rounded-lg border p-1 text-sm ${
                      isToday ? "border-accent bg-accent/5 font-bold text-accent" : "border-border text-foreground"
                    }`}
                  >
                    <span className="leading-tight">{day}</span>
                    <div className="mt-auto flex flex-wrap justify-center gap-0.5">
                      {dayEvents.map((e) => (
                        <span
                          key={e.id}
                          className={`h-1.5 w-1.5 rounded-full ${typeConfig[e.type].dot}`}
                          aria-label={typeConfig[e.type].label}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Próximos eventos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {sortedEvents.map((e) => {
              const cfg = typeConfig[e.type]
              const Icon = cfg.icon
              const date = new Date(e.date + "T00:00:00")
              const monthShort = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
              const title = e.title.replace(/^Prova\b/i, "Avaliação")
              return (
                <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md bg-secondary text-center">
                    <span className="text-sm font-bold leading-none text-foreground">{date.getDate()}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">{monthShort}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">{title}</p>
                    <Badge variant="outline" className={`mt-1.5 gap-1 text-xs ${cfg.className}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
