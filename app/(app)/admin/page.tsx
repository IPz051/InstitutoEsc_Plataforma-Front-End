import {
  BadgeDollarSign,
  BellRing,
  CircleAlert,
  Download,
  FileCheck2,
  FileClock,
  HandCoins,
  IdCard,
  RefreshCw,
  ShieldAlert,
  UserRound,
  Wallet,
} from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const summaryCards = [
  {
    label: "Receita mensal",
    value: "R$ 84.320",
    detail: "+12,4% vs. mês anterior",
    icon: BadgeDollarSign,
  },
  {
    label: "MRR projetado",
    value: "R$ 126.900",
    detail: "Próximos 30 dias",
    icon: Wallet,
  },
  {
    label: "Inadimplentes",
    value: "18 alunos",
    detail: "8 cobranças críticas",
    icon: ShieldAlert,
  },
  {
    label: "Documentos pendentes",
    value: "27 envios",
    detail: "9 fora do prazo",
    icon: FileClock,
  },
]

const revenueRows = [
  { period: "Mensal", revenue: "R$ 84.320", recurring: "R$ 61.450", pending: "R$ 8.210" },
  { period: "Trimestral", revenue: "R$ 241.960", recurring: "R$ 182.700", pending: "R$ 19.480" },
  { period: "Anual", revenue: "R$ 1.012.800", recurring: "R$ 742.200", pending: "R$ 66.900" },
]

const students = [
  {
    name: "Dra. Marina Costa",
    email: "marina@escritorio.com",
    progress: "4 de 19 aulas",
    plan: "Premium",
    payment: "Ativo",
  },
  {
    name: "João Pedro Nunes",
    email: "joao@nunesadv.com",
    progress: "2 de 8 aulas",
    plan: "Essencial",
    payment: "Em atraso",
  },
  {
    name: "Carla Mendes",
    email: "carla@previdlab.com",
    progress: "9 de 12 aulas",
    plan: "Premium",
    payment: "Ativo",
  },
]

const debitRows = [
  {
    student: "João Pedro Nunes",
    plan: "Essencial",
    amount: "R$ 289,90",
    dueDate: "10/07/2026",
    status: "7 dias em aberto",
  },
  {
    student: "Fernanda Rocha",
    plan: "Premium",
    amount: "R$ 498,00",
    dueDate: "05/07/2026",
    status: "12 dias em aberto",
  },
  {
    student: "Rafael Souza",
    plan: "Formação Completa",
    amount: "R$ 1.290,00",
    dueDate: "30/06/2026",
    status: "Crítico",
  },
]

const documentRows = [
  {
    student: "Carla Mendes",
    course: "Formação Completa",
    document: "Documento de identidade",
    status: "Aguardando revisão",
    note: "Enviado há 2 dias",
  },
  {
    student: "Paulo Henrique",
    course: "Imersão em Teses Revisionais",
    document: "Comprovante de vínculo",
    status: "Fora do prazo",
    note: "Prazo expirado há 3 dias",
  },
  {
    student: "Beatriz Lima",
    course: "Mandado de Segurança",
    document: "Contrato assinado",
    status: "Aprovado",
    note: "Observação registrada",
  },
]

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "Ativo" || status === "Aprovado") return "default"
  if (status === "Em atraso" || status === "Crítico" || status === "Fora do prazo") {
    return "destructive"
  }
  return "secondary"
}

export default function AdminPage() {
  return (
    <>
      <AppNavbar title="Painel Administrativo" />
      <div className="flex flex-col gap-8 p-4 md:p-6">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-[#e7ecff]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge variant="secondary" className="bg-[#eef3ff] text-primary">
                Operação administrativa
              </Badge>
              <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Painel Administrativo
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Acompanhe indicadores financeiros, alunos, débitos e documentos em um layout
                mais objetivo, com foco em leitura rápida e ações operacionais.
              </p>
            </div>
          </div>
        </section>

        <section className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className="h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]"
            >
              <CardContent className="flex h-full items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef3ff] text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="flex min-h-[72px] flex-col justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card className="min-h-[360px] h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-primary" />
                Análise financeira
              </CardTitle>
              <CardDescription>
                Receita por período, recorrência e visão de pendências em aberto.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-4">
              <div className="grid gap-3 md:grid-cols-3">
                {revenueRows.map((row) => (
                  <div key={row.period} className="rounded-2xl bg-[#f6f8ff] p-4 ring-1 ring-[#e7ecff]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {row.period}
                    </p>
                    <p className="mt-2 font-heading text-2xl font-bold text-foreground">
                      {row.revenue}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Recorrente: {row.recurring}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Em aberto: {row.pending}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid flex-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Projeção recorrente
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold text-foreground">
                    R$ 126.900
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estimativa de renovação e mensalidades previstas para os próximos 30 dias.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Cobranças monitoradas
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold text-foreground">
                    R$ 8.210
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Títulos com tratativa aberta e potencial de recuperação imediata.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="relative grid items-stretch gap-6 xl:grid-cols-2">
          <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#e7ecff] xl:block" />
          <Card className="min-h-[340px] h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                Gestão de alunos
              </CardTitle>
              <CardDescription>
                Cadastro, progresso por curso, plano ativo e status de pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3">
              {students.map((student) => (
                <div
                  key={student.email}
                  className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-[#fafbff]"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{student.progress}</Badge>
                      <Badge variant="secondary">{student.plan}</Badge>
                      <Badge variant={statusBadgeVariant(student.payment)}>
                        {student.payment}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="min-h-[340px] h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandCoins className="h-4 w-4 text-primary" />
                Gestão de débitos
              </CardTitle>
              <CardDescription>
                Cobranças em aberto com ações rápidas para retenção e negociação.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3">
              {debitRows.map((row) => (
                <div
                  key={`${row.student}-${row.amount}`}
                  className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-[#fafbff]"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{row.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {row.plan} • vencimento em {row.dueDate}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{row.amount}</Badge>
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Reenviar cobrança
                      </Button>
                      <Button variant="outline" size="sm">
                        Negociar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Cancelar matrícula
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="relative grid items-stretch gap-6 xl:grid-cols-2">
          <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#e7ecff] xl:block" />
          <Card className="min-h-[340px] h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-primary" />
                Gestão de documentos
              </CardTitle>
              <CardDescription>
                Visualização, aprovação, rejeição e acompanhamento de pendências por aluno.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3">
              {documentRows.map((row) => (
                <div
                  key={`${row.student}-${row.document}`}
                  className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-[#fafbff]"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{row.document}</p>
                      <p className="text-sm text-muted-foreground">
                        {row.student} • {row.course}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                        <span className="text-xs text-muted-foreground">{row.note}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Aprovar
                      </Button>
                      <Button variant="outline" size="sm">
                        Rejeitar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Adicionar observação
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="min-h-[340px] h-full rounded-3xl border-0 shadow-none ring-1 ring-[#e7ecff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-primary" />
                Pendências críticas
              </CardTitle>
              <CardDescription>
                Alunos com documentos pendentes fora do prazo ou bloqueios de fluxo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3">
              <div className="rounded-2xl bg-[#fff6f1] p-4 ring-1 ring-[#ffe0cc]">
                <div className="flex items-center gap-2">
                  <FileClock className="h-4 w-4 text-[#d97706]" />
                  <p className="font-medium text-foreground">Paulo Henrique</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comprovante de vínculo pendente na Imersão em Teses Revisionais.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f6f8ff] p-4 ring-1 ring-[#e7ecff]">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-primary" />
                  <p className="font-medium text-foreground">Checklist documental</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  14 alunos aguardam validação manual em até 24h.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}
