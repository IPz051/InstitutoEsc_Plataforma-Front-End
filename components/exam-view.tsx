"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  RotateCcw,
  Lock,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Course, Exam } from "@/lib/mock-data"

const TIME_LIMIT = 15 * 60 // 15 minutos

type Phase = "intro" | "running" | "result"

export function ExamView({
  course,
  exam,
  basePath = "/cursos",
}: {
  course: Course
  exam: Exam
  basePath?: string
}) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [attemptsUsed, setAttemptsUsed] = useState(exam.attemptsUsed)
  const [passed, setPassed] = useState(exam.passed)
  const [score, setScore] = useState<number | null>(null)

  const attemptsLeft = exam.maxAttempts - attemptsUsed
  const locked = passed || attemptsLeft <= 0

  const finish = useCallback(() => {
    const correct = exam.questions.filter(
      (q) => answers[q.id] === q.correctOptionId,
    ).length
    const result = Math.round((correct / exam.questions.length) * 100)
    setScore(result)
    setAttemptsUsed((a) => a + 1)
    if (result >= exam.passingScore) setPassed(true)
    setPhase("result")
  }, [answers, exam])

  useEffect(() => {
    if (phase !== "running") return
    if (timeLeft <= 0) {
      finish()
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, finish])

  function start() {
    setAnswers({})
    setTimeLeft(TIME_LIMIT)
    setScore(null)
    setPhase("running")
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")
  const answeredCount = Object.keys(answers).length

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
      <Link
        href={`${basePath}/${course.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao curso
      </Link>

      {/* INTRO */}
      {phase === "intro" && (
        <Card>
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <p className="text-xs font-medium text-accent">{course.title}</p>
              <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">
                {exam.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Info label="Questões" value={`${exam.questions.length}`} />
              <Info label="Nota mínima" value={`${exam.passingScore}%`} />
              <Info label="Tempo" value="15 min" />
              <Info
                label="Tentativas"
                value={`${attemptsLeft}/${exam.maxAttempts}`}
              />
            </div>

            {passed ? (
              <Banner
                tone="success"
                icon={Trophy}
                title="Prova concluída com aprovação"
                desc="Você já atingiu a nota mínima. Esta prova está bloqueada para novas tentativas."
              />
            ) : attemptsLeft <= 0 ? (
              <Banner
                tone="danger"
                icon={Lock}
                title="Tentativas esgotadas"
                desc={`Você utilizou todas as ${exam.maxAttempts} tentativas disponíveis para esta avaliação.`}
              />
            ) : (
              <Banner
                tone="info"
                icon={AlertTriangle}
                title="Antes de começar"
                desc={`Você tem até 15 minutos e ${attemptsLeft} de ${exam.maxAttempts} tentativas restantes. Ao atingir ${exam.passingScore}%, a prova será bloqueada.`}
              />
            )}

            <Button size="lg" onClick={start} disabled={locked}>
              {locked ? (
                <>
                  <Lock className="h-4 w-4" />
                  Prova bloqueada
                </>
              ) : (
                "Iniciar prova"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* RUNNING */}
      {phase === "running" && (
        <>
          <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Respondidas:</span>
              <span className="font-semibold text-foreground">
                {answeredCount}/{exam.questions.length}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-semibold",
                timeLeft < 60
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-foreground",
              )}
            >
              <Clock className="h-4 w-4" />
              {mm}:{ss}
            </div>
          </div>

          {exam.questions.map((q, i) => (
            <Card key={q.id}>
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 font-medium leading-relaxed text-foreground">
                    {q.statement}
                  </p>
                </div>
                <RadioGroup
                  value={answers[q.id] ?? ""}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  className="flex flex-col gap-2 pl-10"
                >
                  {q.options.map((opt) => (
                    <Label
                      key={opt.id}
                      htmlFor={`${q.id}-${opt.id}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-normal transition-colors",
                        answers[q.id] === opt.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <RadioGroupItem id={`${q.id}-${opt.id}`} value={opt.id} />
                      {opt.text}
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <Button
            size="lg"
            onClick={finish}
            disabled={answeredCount < exam.questions.length}
          >
            Finalizar prova
          </Button>
          {answeredCount < exam.questions.length && (
            <p className="-mt-3 text-center text-xs text-muted-foreground">
              Responda todas as questões para finalizar.
            </p>
          )}
        </>
      )}

      {/* RESULT */}
      {phase === "result" && score !== null && (
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full",
                score >= exam.passingScore
                  ? "bg-accent/10 text-accent"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {score >= exam.passingScore ? (
                <Trophy className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {score >= exam.passingScore ? "Parabéns, você foi aprovado!" : "Você não atingiu a nota mínima"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nota mínima para aprovação: {exam.passingScore}%
              </p>
            </div>

            <div className="w-full max-w-xs">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sua nota</span>
                <span className="font-heading text-xl font-bold text-foreground">{score}%</span>
              </div>
              <Progress value={score} />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {passed ? (
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  Prova bloqueada após aprovação
                </span>
              ) : (
                <span>
                  Tentativas restantes:{" "}
                  <strong className="text-foreground">
                    {exam.maxAttempts - attemptsUsed} de {exam.maxAttempts}
                  </strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {!passed && exam.maxAttempts - attemptsUsed > 0 && (
                <Button onClick={start}>
                  <RotateCcw className="h-4 w-4" />
                  Tentar novamente
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={`${basePath}/${course.id}`}>Voltar ao curso</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3 text-center">
      <p className="font-heading text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Banner({
  tone,
  icon: Icon,
  title,
  desc,
}: {
  tone: "info" | "success" | "danger"
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  const styles = {
    info: "border-accent/20 bg-accent/5 text-accent",
    success: "border-gold/30 bg-gold/10 text-gold-foreground",
    danger: "border-destructive/20 bg-destructive/5 text-destructive",
  }[tone]
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", styles)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-foreground/70">{desc}</p>
      </div>
    </div>
  )
}
