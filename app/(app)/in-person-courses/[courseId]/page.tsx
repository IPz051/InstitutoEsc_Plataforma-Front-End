"use client"

import { use, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Link as LinkIcon,
  Download,
  FileText,
  Coins,
  CreditCard,
  QrCode,
  FileBarChart,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { ExpandableText } from "@/components/expandable-text"
import { ProfessorTagCard } from "@/components/professor-tag-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { getInPersonProfessorTags } from "@/lib/in-person-professor-tags"
import { getInPersonCourse, inPersonCourses } from "@/lib/mock-data"
import { getCourseById } from "@/services/courses/coursesService"
import { checkCourseAccess } from "@/services/enrollments/enrollmentsService"
import { getCoursePaymentStatus, initiateCheckout, updatePaymentMethod } from "@/services/charges/chargesService"
import { useAuthStore } from "@/stores/authStore"
import type { CourseDetailResponse, InstructorDetailResponse, PaymentMethod } from "@/types"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

export default function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const [course, setCourse] = useState<CourseDetailResponse | null>(null)
  const [mockCourse, setMockCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paymentTimeout, setPaymentTimeout] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"checkout" | "update">("checkout")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CREDIT_CARD")
  const [pendingInvoiceUrl, setPendingInvoiceUrl] = useState<string | null>(null)
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<PaymentMethod | null>(null)
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        // Fetch from API contract GET /courses/{id}
        const data = await getCourseById(courseId)
        setCourse(data)

        // Also fetch local metadata to combine if available
        const localMock = getInPersonCourse(courseId)
        if (localMock) {
          setMockCourse(localMock)
        }
        setIsFallback(false)
      } catch (error) {
        console.warn(`API call failed for in-person courseId ${courseId}, trying fallback:`, error)
        const localMock = getInPersonCourse(courseId)
        if (localMock) {
          setMockCourse(localMock)
          setIsFallback(true)
        } else {
          setMockCourse(null)
          setIsFallback(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  useEffect(() => {
    async function verifyEnrollmentAndPayment() {
      if (!isAuthenticated) return
      try {
        const [access, paymentStatus] = await Promise.all([
          checkCourseAccess(courseId),
          getCoursePaymentStatus(courseId),
        ])
        const enrolled = access.status === "ATIVA" || access.status === "CONCLUIDA" || access.status === "PENDENTE"
        setIsEnrolled(enrolled)
        if (!enrolled && paymentStatus.hasPayment && !paymentStatus.paid && paymentStatus.invoiceUrl) {
          setPendingInvoiceUrl(paymentStatus.invoiceUrl)
          setPendingPaymentMethod(paymentStatus.paymentMethod)
        }
      } catch (error) {
        console.error("Failed to check course enrollment/payment status:", error)
      }
    }

    verifyEnrollmentAndPayment()
  }, [courseId, isAuthenticated])

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  function startPolling() {
    setPaymentTimeout(false)
    let attempts = 0
    const MAX_ATTEMPTS = 40

    pollingRef.current = setInterval(async () => {
      attempts++
      try {
        const access = await checkCourseAccess(courseId)
        if (access.hasAccess) {
          stopPolling()
          setIsEnrolled(true)
          setPendingInvoiceUrl(null)
          setPendingPaymentMethod(null)
          toast.success("Pagamento confirmado! Você já tem acesso ao curso.")
          return
        }
      } catch {
        // continua tentando
      }

      if (attempts >= MAX_ATTEMPTS) {
        stopPolling()
        setPaymentTimeout(true)
      }
    }, 3000)
  }

  function handleResumePayment() {
    setResumeDialogOpen(true)
  }

  function confirmResumePayment() {
    setResumeDialogOpen(false)
    if (!pendingInvoiceUrl) return
    window.open(pendingInvoiceUrl, "_blank")
    startPolling()
  }

  function handleCheckout() {
    if (!isAuthenticated) {
      window.location.href = "/"
      return
    }
    setDialogMode("checkout")
    setSelectedMethod("CREDIT_CARD")
    setDialogOpen(true)
  }

  function handleChangePaymentMethod() {
    setDialogMode("update")
    setSelectedMethod("CREDIT_CARD")
    setDialogOpen(true)
  }

  async function confirmPaymentDialog() {
    try {
      setCheckoutLoading(true)
      setDialogOpen(false)
      const { invoiceUrl } = dialogMode === "checkout"
        ? await initiateCheckout(courseId, selectedMethod)
        : await updatePaymentMethod(courseId, selectedMethod)
      setPendingInvoiceUrl(invoiceUrl)
      setPendingPaymentMethod(selectedMethod)
      window.open(invoiceUrl, "_blank")
      startPolling()
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setIsEnrolled(true)
        setPendingInvoiceUrl(null)
        setPendingPaymentMethod(null)
        toast.success("Você já está inscrito neste curso.")
      } else {
        toast.error(
          dialogMode === "checkout"
            ? "Não foi possível iniciar o processo de inscrição. Tente novamente."
            : "Não foi possível alterar o meio de pagamento. Tente novamente."
        )
      }
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppNavbar title="Cursos presenciais" />
        <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
          <div className="h-6 w-32 rounded bg-muted/20" />
          <div className="h-64 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
          <div className="h-10 w-48 rounded bg-muted/20" />
          <div className="h-32 rounded-2xl bg-white shadow-sm ring-1 ring-[#e7ecff]" />
        </div>
      </>
    )
  }

  if (!course && !mockCourse) {
    notFound()
  }

  // Local meta reference
  const meta = inPersonCourses.find((c) => c.id === courseId)
  const professorTags = getInPersonProfessorTags(courseId)
  const firstLessonId = mockCourse?.modules?.[0]?.lessons?.[0]?.id ?? "demo"

  // Setup view variables combining API response and mocked fallbacks
  const title = course?.name || mockCourse?.title || "Curso Presencial"
  const description = course?.description || mockCourse?.description || ""
  const thumbnail = course?.thumbnailUrl || mockCourse?.thumbnail || "/placeholder.svg"

  // Workload: Real if from API, otherwise mock in red
  const isDurationMocked = !course?.duration
  const durationText = course?.duration || meta?.duration || "Duração a definir"

  // Date rendering
  let eventDateText = ""
  let isDateMocked = false
  if (course?.details?.eventStartsAt) {
    const start = formatDate(course.details.eventStartsAt)
    const end = course.details.eventEndsAt ? formatDate(course.details.eventEndsAt) : null
    eventDateText = end ? `${start} até ${end}` : start
  } else if (meta?.date) {
    eventDateText = meta.date
    isDateMocked = true
  } else {
    eventDateText = "Data a confirmar"
    isDateMocked = true
  }

  // Venue rendering
  let eventVenueText = ""
  let isVenueMocked = false
  if (course?.details?.establishmentName) {
    const details = course.details
    const addr = [details.addressStreet, details.addressCity, details.addressState].filter(Boolean).join(", ")
    eventVenueText = addr ? `${details.establishmentName} (${addr})` : (details.establishmentName || "")
  } else if (meta?.venue) {
    eventVenueText = meta.venue
    isVenueMocked = true
  } else {
    eventVenueText = "Local a confirmar"
    isVenueMocked = true
  }

  // Registration rendering
  let registrationText = ""
  let isRegistrationMocked = false
  if (course?.details?.registrationStartsAt) {
    const start = formatShortDate(course.details.registrationStartsAt)
    const end = course.details.registrationEndsAt ? formatShortDate(course.details.registrationEndsAt) : null
    registrationText = end ? `De ${start} até ${end}` : `A partir de ${start}`
  } else {
    registrationText = "Período de inscrições a confirmar"
    isRegistrationMocked = true
  }

  // Price rendering
  let priceText = "A confirmar"
  let isPriceMocked = false
  if (course?.price !== undefined && course?.price !== null) {
    priceText = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(course.price)
  } else {
    priceText = "A confirmar"
    isPriceMocked = true
  }

  return (
    <>
      <AppNavbar title="Cursos presenciais" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Link
          href="/courses?type=in-person"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>

        {isFallback && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">⚠️ Modo Fallback (Dados Locais Mockados)</p>
            <p className="mt-1">
              Este curso presencial não foi encontrado no banco de dados através da API. Exibindo dados locais com campos não suportados pelo contrato destacados em vermelho.
            </p>
          </div>
        )}

        <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1.6fr_1fr] md:p-6">
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit border-accent/20 bg-accent/10 text-accent">
              Cursos presenciais
            </Badge>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground text-balance">
              {title}
            </h2>
            <ExpandableText text={description} />

            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              {/* Date */}
              <div className={`flex items-center gap-2 ${isDateMocked ? "text-red-500" : "text-foreground"}`}>
                <CalendarDays className={`h-4 w-4 ${isDateMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventDateText} {isDateMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              <div className={`flex items-center gap-2 ${isVenueMocked ? "text-red-500" : "text-foreground"}`}>
                <MapPin className={`h-4 w-4 ${isVenueMocked ? "text-red-500" : "text-accent"}`} />
                <span>{eventVenueText} {isVenueMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              {/* Registration Period */}
              <div className={`flex items-center gap-2 ${isRegistrationMocked ? "text-red-500" : "text-foreground"}`}>
                <CalendarDays className={`h-4 w-4 ${isRegistrationMocked ? "text-red-500" : "text-accent"}`} />
                <span>Período de inscrição: {registrationText} {isRegistrationMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>

              {/* Duration */}
              <div className={`flex items-center gap-2 ${isDurationMocked ? "text-red-500" : "text-foreground"}`}>
                <Clock3 className={`h-4 w-4 ${isDurationMocked ? "text-red-500" : "text-accent"}`} />
                <span>Duração: {durationText} {isDurationMocked && <span className="text-xs opacity-85">(Mock)</span>}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Investimento</span>
                <span className={`text-2xl font-bold ${isPriceMocked ? "text-red-500" : "text-foreground"}`}>
                  {priceText}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {!isEnrolled && pendingInvoiceUrl ? (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8"
                      disabled={checkoutLoading}
                      onClick={handleChangePaymentMethod}
                    >
                      {checkoutLoading ? "Aguarde..." : "Alterar meio de pagamento"}
                    </Button>
                    <Button
                      size="lg"
                      className="px-8"
                      disabled={checkoutLoading}
                      onClick={handleResumePayment}
                    >
                      Realizar pagamento
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    className="px-8"
                    disabled={isEnrolled || checkoutLoading}
                    onClick={handleCheckout}
                  >
                    {isEnrolled ? "Inscrito" : checkoutLoading ? "Aguarde..." : "Inscrever-se"}
                  </Button>
                )}
              </div>
            </div>

            {!isEnrolled && pendingInvoiceUrl && pendingPaymentMethod && (
              <p className="mt-3 text-xs text-muted-foreground">
                Pagamento pendente via{" "}
                <span className="font-medium text-foreground">
                  {pendingPaymentMethod === "CREDIT_CARD" ? "Cartão de crédito" : pendingPaymentMethod === "PIX" ? "PIX" : "Boleto bancário"}
                </span>
              </p>
            )}

            {paymentTimeout && !isEnrolled && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">Pagamento em processamento</p>
                <p className="mt-1 text-amber-700">
                  Não identificamos a confirmação ainda — isso é normal para PIX e boleto. Recarregue a página mais tarde para verificar seu acesso.
                </p>
              </div>
            )}
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-secondary/50">
            <Image
              src={thumbnail}
              alt={`Imagem representativa do curso ${title}`}
              fill
              priority
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
              style={{ objectPosition: meta?.heroPosition ?? "center" }}
            />
          </div>
        </section>

        {/* Real Links & Files from API Contract (Normal colors) */}
        {((course?.links && course.links.length > 0) || (course?.files && course.files.length > 0)) && (
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Materiais de Apoio e Links do Curso
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Files */}
              {course.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4 transition-all hover:border-accent/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{file.title}</p>
                    <p className="text-xs text-muted-foreground">Arquivo para Download</p>
                  </div>
                  <Button size="icon" variant="ghost" asChild>
                    <a href={`/api/files/download/${file.id}`} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
              {/* Links */}
              {course.links.map((lnk, idx) => (
                <a
                  key={idx}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4 transition-all hover:border-accent/40 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{lnk.title}</p>
                    <p className="truncate text-xs text-accent">{lnk.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Informações do curso
          </h3>
          <div className="flex flex-col gap-4">
            {/* Professors: Real if instructors exist, otherwise Mocked in red */}
            <div
              className={`overflow-hidden rounded-xl border bg-card p-4 ${(course?.instructors && course.instructors.length > 0) ? "border-border" : "border-red-200"}`}
            >
              <div className="flex items-center gap-3 border-b border-dashed pb-3 mb-3 border-border">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${(course?.instructors && course.instructors.length > 0) ? "bg-primary text-primary-foreground" : "bg-red-500 text-white"}`}>
                  <Users className="h-4 w-4" />
                </span>
                <p className={`font-heading text-sm font-semibold ${(course?.instructors && course.instructors.length > 0) ? "text-foreground" : "text-red-500"}`}>
                  Professor(es) {!(course?.instructors && course.instructors.length > 0) && <span className="text-xs font-normal opacity-85">(Mock)</span>}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {course?.instructors && course.instructors.length > 0 ? (
                  course.instructors.map((inst) => (
                    <div key={inst.id} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/10 p-4">
                      {inst.profileImageUrl ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-card">
                          <Image
                            src={inst.profileImageUrl}
                            alt={inst.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Users className="h-8 w-8" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-heading text-base font-semibold text-foreground">{inst.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{inst.description || "Professor principal do curso."}</p>
                      </div>
                    </div>
                  ))
                ) : professorTags?.length ? (
                  <div className="flex flex-col gap-3 border border-red-100 p-3 rounded-lg bg-red-50/10">
                    {professorTags.map((professor) => (
                      <ProfessorTagCard
                        key={`${professor.name}-${professor.imageSrc}`}
                        professor={professor}
                      />
                    ))}
                    <p className="text-[10px] text-red-400 text-right font-medium">(Professores Mockados em vermelho)</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 text-sm text-red-500 font-medium">
                    {(meta?.professors?.length ? meta.professors : ["A definir"]).map((professor) => (
                      <li key={professor}>{professor} <span className="text-xs font-normal opacity-85">(Mock)</span></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Simple confirmation dialog for resuming a pending payment */}
      <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Continuar pagamento</DialogTitle>
            <DialogDescription>
              Você será redirecionado para a página segura de pagamento do Asaas para concluir sua inscrição. Clique em continuar para prosseguir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmResumePayment}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment method selector — used for both checkout and update-payment */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "update" ? "Alterar meio de pagamento" : "Escolha a forma de pagamento"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "update"
                ? "O link de pagamento anterior será cancelado e um novo será gerado com o método escolhido. Você será redirecionado para a página segura do Asaas."
                : "Você será redirecionado para a página segura de pagamento do Asaas. Escolha como deseja pagar e clique em continuar."}
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={selectedMethod}
            onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}
            className="mt-2 flex flex-col gap-3"
          >
            <Label
              htmlFor="method-credit"
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${selectedMethod === "CREDIT_CARD" ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}
            >
              <RadioGroupItem value="CREDIT_CARD" id="method-credit" />
              <CreditCard className="h-5 w-5 text-accent shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground">Cartão de crédito</span>
                <span className="text-xs text-muted-foreground">Parcelamento em até 3x</span>
              </div>
            </Label>

            <Label
              htmlFor="method-pix"
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${selectedMethod === "PIX" ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}
            >
              <RadioGroupItem value="PIX" id="method-pix" />
              <QrCode className="h-5 w-5 text-accent shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground">PIX</span>
                <span className="text-xs text-muted-foreground">Pagamento à vista, confirmação em minutos</span>
              </div>
            </Label>

            <Label
              htmlFor="method-boleto"
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${selectedMethod === "BOLETO" ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}
            >
              <RadioGroupItem value="BOLETO" id="method-boleto" />
              <FileBarChart className="h-5 w-5 text-accent shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground">Boleto bancário</span>
                <span className="text-xs text-muted-foreground">Pagamento à vista, compensação em até 1 dia útil</span>
              </div>
            </Label>
          </RadioGroup>

          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmPaymentDialog} disabled={checkoutLoading}>
              {checkoutLoading ? "Aguarde..." : "Continuar para o pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
