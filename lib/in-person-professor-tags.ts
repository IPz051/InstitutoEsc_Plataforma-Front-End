import type { ProfessorTag } from "@/components/professor-tag-card"

export const inPersonProfessorTagsByCourse: Partial<Record<string, ProfessorTag[]>> = {
  "acidente-trabalho": [
    {
      imageSrc: "/professor-tags/carlos-alberto/carlos-alberto-foto.png",
      imageAlt: "Carlos Alberto Pereira de Castro",
      name: "Carlos Alberto Pereira de Castro",
      description:
        "Juiz do Trabalho da 12ª Região (SC). Diretor de Relacionamento com o Direito do Trabalho do IBDP. Doutorando em Ciências Jurídicas pela Universidade Autónoma de Lisboa.",
    },
    {
      imageSrc: "/professor-tags/joao-batista/joao-batista-foto.png",
      imageAlt: "João Batista Lazzari",
      name: "João Batista Lazzari",
      description:
        "Diretor de Processo Judicial Previdenciário do IBDP. Pós-doutor em Direito e Justiça Constitucional. Juiz Federal do TRF da 4ª Região (1996-2023). Coautor das obras: Manual de Direito Previdenciário, 29 ed. Forense, 2026, Prática Processual Previdenciária, 18 ed. Forense, 2026, dentre outras.",
    },
  ],
  "teses-revisionais": [
    {
      imageSrc: "/professor-tags/marco-serau/marco-serau-foto.png",
      imageAlt: "Marco Aurélio Serau Junior",
      name: "Marco Aurélio Serau Junior",
      description:
        "Advogado. Especialista em Direito Previdenciário. Presidente da Comissão de Direito Previdenciário Regime Próprio da OAB/SC. Membro consultor da Comissão Especial de Direito Previdenciário, da OAB Nacional. Diretor de Amicus Curiae do Instituto de Estudos Previdenciários - IEPREV.",
    },
  ],
  "processo-judicial-previdenciario": [
    {
      imageSrc: "/professor-tags/lucas-alberton/lucas-alberton.png",
      imageAlt: "Lucas Alberton",
      name: "Lucas Alberton",
      description:
        "Advogado Previdenciarista; Mestre em Direito; Especialista em Direito Previdenciário; Professor de Direito Processual Civil, Direito Previdenciário e Ética Profissional na Graduação e em Diversos Institutos de Pós Graduação;",
    },
  ],
  "mandado-seguranca-imersao": [
    {
      imageSrc: "/professor-tags/carlos-alberto/carlos-alberto-foto.png",
      imageAlt: "Carlos Alberto Pereira de Castro",
      name: "Carlos Alberto Pereira de Castro",
      description:
        "Juiz do Trabalho da 12ª Região (SC). Diretor de Relacionamento com o Direito do Trabalho do IBDP. Doutorando em Ciências Jurídicas pela Universidade Autónoma de Lisboa.",
    },
    {
      imageSrc: "/professor-tags/joao-batista/joao-batista-foto.png",
      imageAlt: "João Batista Lazzari",
      name: "João Batista Lazzari",
      description:
        "Diretor de Processo Judicial Previdenciário do IBDP. Pós-doutor em Direito e Justiça Constitucional. Juiz Federal do TRF da 4ª Região (1996-2023). Coautor das obras: Manual de Direito Previdenciário, 29 ed. Forense, 2026, Prática Processual Previdenciária, 18 ed. Forense, 2026, dentre outras.",
    },
  ],
}

export function getInPersonProfessorTags(courseId: string) {
  return inPersonProfessorTagsByCourse[courseId]
}
