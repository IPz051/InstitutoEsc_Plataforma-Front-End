import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AppNavbar } from "@/components/app-navbar"
import { LessonView } from "@/components/lesson-view"
import { getInPersonLessonContext } from "@/lib/mock-data"

export default async function InPersonLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const context = getInPersonLessonContext(courseId, lessonId)
  if (!context) notFound()

  const professorTagsByCourse = {
    "acidente-trabalho": [
      {
        imageSrc: "/tags%20professores/Carlos%20Alberto/Carlos%20Alberto%20foto.png",
        imageAlt: "Carlos Alberto Pereira de Castro",
        name: "Carlos Alberto Pereira de Castro",
        description:
          "Juiz do Trabalho da 12ª Região (SC). Diretor de Relacionamento com o Direito do Trabalho do IBDP. Doutorando em Ciências Jurídicas pela Universidade Autónoma de Lisboa.",
      },
      {
        imageSrc: "/tags%20professores/Jo%C3%A3o%20Batista/Jo%C3%A3o%20Batista%20foto.png",
        imageAlt: "João Batista Lazzari",
        name: "João Batista Lazzari",
        description:
          "Diretor de Processo Judicial Previdenciário do IBDP. Pós-doutor em Direito e Justiça Constitucional. Juiz Federal do TRF da 4ª Região (1996-2023). Coautor das obras: Manual de Direito Previdenciário, 29 ed. Forense, 2026, Prática Processual Previdenciária, 18 ed. Forense, 2026, dentre outras.",
      },
    ],
    "teses-revisionais": [
      {
        imageSrc: "/tags%20professores/Marco%20Serau/Marco%20Serau%20-%20foto.png",
        imageAlt: "Marco Serau",
        name: "Marco Serau",
        description:
          "Advogado. Especialista em Direito Previdenciário. Presidente da Comissão de Direito Previdenciário Regime Próprio da OAB/SC. Membro consultor da Comissão Especial de Direito Previdenciário, da OAB Nacional. Diretor de Amicus Curiae do Instituto de Estudos Previdenciários - IEPREV.",
      },
    ],
    "processo-judicial-previdenciario": [
      {
        imageSrc: "/tags%20professores/Lucas%20Alberton/Lucas%20Alberton.png",
        imageAlt: "Lucas Alberton",
        name: "Lucas Alberton",
        description:
          "Advogado Previdenciarista; Mestre em Direito; Especialista em Direito Previdenciário; Professor de Direito Processual Civil, Direito Previdenciário e Ética Profissional na Graduação e em Diversos Institutos de Pós Graduação;",
      },
    ],
    "mandado-seguranca-imersao": [
      {
        imageSrc: "/tags%20professores/Carlos%20Alberto/Carlos%20Alberto%20foto.png",
        imageAlt: "Carlos Alberto Pereira de Castro",
        name: "Carlos Alberto Pereira de Castro",
        description:
          "Juiz do Trabalho da 12ª Região (SC). Diretor de Relacionamento com o Direito do Trabalho do IBDP. Doutorando em Ciências Jurídicas pela Universidade Autónoma de Lisboa.",
      },
      {
        imageSrc: "/tags%20professores/Jo%C3%A3o%20Batista/Jo%C3%A3o%20Batista%20foto.png",
        imageAlt: "João Batista Lazzari",
        name: "João Batista Lazzari",
        description:
          "Diretor de Processo Judicial Previdenciário do IBDP. Pós-doutor em Direito e Justiça Constitucional. Juiz Federal do TRF da 4ª Região (1996-2023). Coautor das obras: Manual de Direito Previdenciário, 29 ed. Forense, 2026, Prática Processual Previdenciária, 18 ed. Forense, 2026, dentre outras.",
      },
    ],
  } as const

  const professorTags = professorTagsByCourse[courseId as keyof typeof professorTagsByCourse]

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar title={context.course.title} />
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <Link
          href="/cursos?tipo=presenciais"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cursos presenciais
        </Link>
      </div>
      <LessonView
        course={context.course}
        current={context.current}
        prev={context.prev}
        next={context.next}
        basePath="/cursos-presenciais"
        professorTags={professorTags}
      />
    </div>
  )
}
