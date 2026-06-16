export type CourseStatus = "em-andamento" | "concluido" | "nao-iniciado"

export interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  description: string
  videoUrl: string
}

export interface Exam {
  id: string
  title: string
  questions: Question[]
  passingScore: number
  maxAttempts: number
  attemptsUsed: number
  passed: boolean
}

export interface Question {
  id: string
  statement: string
  options: { id: string; text: string }[]
  correctOptionId: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
  exam?: Exam
}

export interface Course {
  id: string
  title: string
  shortDescription: string
  description: string
  professor: string
  professorRole: string
  workload: string
  totalLessons: number
  progress: number
  status: CourseStatus
  category: string
  thumbnail: string
  modules: Module[]
}

export interface InPersonCourse {
  id: string
  title: string
  city: string
  state: string
  month: string
  year: string
  status: "em-andamento" | "em-breve"
  track: string
  progress?: number
  completedLessons?: number
  totalLessons?: number
  availableLabel?: string
}

export interface Certificate {
  id: string
  courseTitle: string
  issueDate: string
  status: "emitido" | "pendente"
  hours: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date
  type: "aula" | "prova" | "evento"
}

export interface CommunityPost {
  id: string
  author: string
  avatarInitials: string
  category: string
  timeAgo: string
  title: string
  content: string
  likes: number
  comments: CommunityComment[]
}

export interface CommunityComment {
  id: string
  author: string
  avatarInitials: string
  timeAgo: string
  content: string
  likes: number
}

export const student = {
  name: "Mariana Costa",
  firstName: "Mariana",
  email: "mariana.costa@email.com",
  initials: "MC",
  role: "Pós-graduação em Direito Previdenciário",
  planName: "Premium",
  planDetails: "Plano ativo • trava vitalícia",
}

function makeQuestions(prefix: string): Question[] {
  return [
    {
      id: `${prefix}-q1`,
      statement:
        "Qual instrumento processual é adequado para destravar processos administrativos previdenciários parados por tempo excessivo?",
      options: [
        { id: "a", text: "Ação rescisória" },
        { id: "b", text: "Mandado de segurança" },
        { id: "c", text: "Embargos de declaração" },
        { id: "d", text: "Reclamação constitucional" },
      ],
      correctOptionId: "b",
    },
    {
      id: `${prefix}-q2`,
      statement: "O prazo decadencial para impetração de mandado de segurança é de:",
      options: [
        { id: "a", text: "30 dias" },
        { id: "b", text: "60 dias" },
        { id: "c", text: "120 dias" },
        { id: "d", text: "180 dias" },
      ],
      correctOptionId: "c",
    },
    {
      id: `${prefix}-q3`,
      statement: "O direito líquido e certo no mandado de segurança refere-se a:",
      options: [
        { id: "a", text: "Direito de valor elevado" },
        { id: "b", text: "Direito comprovado de plano, por prova documental" },
        { id: "c", text: "Direito reconhecido em sentença" },
        { id: "d", text: "Direito que admite dilação probatória" },
      ],
      correctOptionId: "b",
    },
    {
      id: `${prefix}-q4`,
      statement: "Sobre a inteligência emocional aplicada à advocacia, é correto afirmar que:",
      options: [
        { id: "a", text: "É irrelevante para a prática jurídica" },
        { id: "b", text: "Auxilia na gestão de conflitos e no atendimento ao cliente" },
        { id: "c", text: "Substitui o conhecimento técnico" },
        { id: "d", text: "Aplica-se apenas à área criminal" },
      ],
      correctOptionId: "b",
    },
    {
      id: `${prefix}-q5`,
      statement: "A gestão eficiente de um escritório de advocacia previdenciária depende de:",
      options: [
        { id: "a", text: "Apenas captação de clientes" },
        { id: "b", text: "Processos, indicadores e organização de prazos" },
        { id: "c", text: "Exclusivamente da quantidade de advogados" },
        { id: "d", text: "Não depende de planejamento" },
      ],
      correctOptionId: "b",
    },
  ]
}

export const courses: Course[] = [
  {
    id: "mandado-seguranca",
    title: "Mandado de Segurança Previdenciário",
    shortDescription: "Domine o MS para destravar processos administrativos parados.",
    description:
      "Curso intensivo que ensina, passo a passo, quando cabe mandado de segurança no âmbito previdenciário, como estruturar a impetração e qual caminho seguir até a decisão. Ideal para advogados que enfrentam processos parados em análise por meses ou anos.",
    professor: "Prof. Marco Serau",
    professorRole: "Doutor em Direito Previdenciário",
    workload: "40 horas",
    totalLessons: 8,
    progress: 62,
    status: "em-andamento",
    category: "Direito Previdenciário",
    thumbnail: "/courses/mandado-seguranca.png",
    modules: [
      {
        id: "ms-mod1",
        title: "Fundamentos do Mandado de Segurança",
        lessons: [
          {
            id: "ms-l1",
            title: "Introdução ao Mandado de Segurança",
            duration: "18 min",
            completed: true,
            description:
              "Nesta aula inaugural, apresentamos os conceitos essenciais do mandado de segurança e sua aplicação no direito previdenciário.",
            videoUrl: "",
          },
          {
            id: "ms-l2",
            title: "Direito Líquido e Certo",
            duration: "24 min",
            completed: true,
            description: "Entenda o requisito do direito líquido e certo e como demonstrá-lo de plano.",
            videoUrl: "",
          },
          {
            id: "ms-l3",
            title: "Prazo Decadencial e Legitimidade",
            duration: "21 min",
            completed: true,
            description: "Os prazos e as partes legítimas para impetrar o mandado de segurança.",
            videoUrl: "",
          },
        ],
      },
      {
        id: "ms-mod2",
        title: "Estruturando a Impetração",
        lessons: [
          {
            id: "ms-l4",
            title: "Petição Inicial do MS",
            duration: "32 min",
            completed: true,
            description: "Como redigir uma petição inicial robusta e bem fundamentada.",
            videoUrl: "",
          },
          {
            id: "ms-l5",
            title: "Documentação Probatória",
            duration: "27 min",
            completed: true,
            description: "Quais documentos juntar para comprovar o direito líquido e certo.",
            videoUrl: "",
          },
          {
            id: "ms-l6",
            title: "Liminar em Mandado de Segurança",
            duration: "29 min",
            completed: false,
            description: "Requisitos e estratégias para obtenção de liminares.",
            videoUrl: "",
          },
        ],
        exam: {
          id: "ms-exam1",
          title: "Avaliação - Estruturando a Impetração",
          passingScore: 70,
          maxAttempts: 5,
          attemptsUsed: 1,
          passed: false,
          questions: makeQuestions("ms-e1"),
        },
      },
      {
        id: "ms-mod3",
        title: "Acompanhamento até a Decisão",
        lessons: [
          {
            id: "ms-l7",
            title: "Trâmite Processual",
            duration: "23 min",
            completed: false,
            description: "O caminho do processo após a impetração até a decisão final.",
            videoUrl: "",
          },
          {
            id: "ms-l8",
            title: "Recursos e Cumprimento",
            duration: "26 min",
            completed: false,
            description: "Recursos cabíveis e cumprimento da decisão obtida.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "gestao-escritorio",
    title: "Gestão de Escritórios de Advocacia",
    shortDescription: "Estruture processos, indicadores e produtividade no seu escritório.",
    description:
      "Aprenda a organizar e escalar um escritório de advocacia previdenciária com gestão de processos, controle de prazos, indicadores de desempenho e estratégias de captação e fidelização de clientes.",
    professor: "Profa. Helena Martins",
    professorRole: "Especialista em Gestão Jurídica",
    workload: "30 horas",
    totalLessons: 6,
    progress: 100,
    status: "concluido",
    category: "Gestão",
    thumbnail: "/courses/gestao-escritorio.png",
    modules: [
      {
        id: "ge-mod1",
        title: "Fundamentos de Gestão",
        lessons: [
          {
            id: "ge-l1",
            title: "Visão Estratégica do Escritório",
            duration: "20 min",
            completed: true,
            description: "Como pensar o escritório como um negócio sustentável.",
            videoUrl: "",
          },
          {
            id: "ge-l2",
            title: "Gestão de Processos e Prazos",
            duration: "25 min",
            completed: true,
            description: "Ferramentas e métodos para nunca perder um prazo.",
            videoUrl: "",
          },
          {
            id: "ge-l3",
            title: "Indicadores de Desempenho",
            duration: "22 min",
            completed: true,
            description: "Os principais KPIs para acompanhar a saúde do escritório.",
            videoUrl: "",
          },
        ],
      },
      {
        id: "ge-mod2",
        title: "Crescimento e Pessoas",
        lessons: [
          {
            id: "ge-l4",
            title: "Captação de Clientes",
            duration: "28 min",
            completed: true,
            description: "Estratégias éticas de captação no meio jurídico.",
            videoUrl: "",
          },
          {
            id: "ge-l5",
            title: "Gestão de Equipe",
            duration: "24 min",
            completed: true,
            description: "Como liderar e desenvolver sua equipe.",
            videoUrl: "",
          },
          {
            id: "ge-l6",
            title: "Tecnologia no Escritório",
            duration: "19 min",
            completed: true,
            description: "Ferramentas tecnológicas que aumentam a produtividade.",
            videoUrl: "",
          },
        ],
        exam: {
          id: "ge-exam1",
          title: "Avaliação Final - Gestão",
          passingScore: 70,
          maxAttempts: 5,
          attemptsUsed: 2,
          passed: true,
          questions: makeQuestions("ge-e1"),
        },
      },
    ],
  },
  {
    id: "inteligencia-emocional",
    title: "Inteligência Emocional na Advocacia",
    shortDescription: "Desenvolva equilíbrio emocional para uma carreira jurídica de excelência.",
    description:
      "Curso que une desenvolvimento pessoal e prática jurídica, abordando autoconhecimento, gestão de conflitos, comunicação assertiva e resiliência para advogados.",
    professor: "Prof. Ricardo Almeida",
    professorRole: "Psicólogo e Coach Jurídico",
    workload: "20 horas",
    totalLessons: 4,
    progress: 25,
    status: "em-andamento",
    category: "Desenvolvimento Pessoal",
    thumbnail: "/courses/inteligencia-emocional.png",
    modules: [
      {
        id: "ie-mod1",
        title: "Autoconhecimento e Equilíbrio",
        lessons: [
          {
            id: "ie-l1",
            title: "O que é Inteligência Emocional",
            duration: "16 min",
            completed: true,
            description: "Conceitos fundamentais da inteligência emocional aplicada.",
            videoUrl: "",
          },
          {
            id: "ie-l2",
            title: "Gestão do Estresse",
            duration: "22 min",
            completed: false,
            description: "Técnicas para lidar com a pressão da rotina jurídica.",
            videoUrl: "",
          },
          {
            id: "ie-l3",
            title: "Comunicação Assertiva",
            duration: "19 min",
            completed: false,
            description: "Como se comunicar com clareza e empatia.",
            videoUrl: "",
          },
          {
            id: "ie-l4",
            title: "Resiliência na Carreira",
            duration: "21 min",
            completed: false,
            description: "Construindo resiliência para uma carreira duradoura.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "pericia-medica",
    title: "Perícia Médica Previdenciária",
    shortDescription: "Entenda o processo pericial e como atuar de forma estratégica.",
    description:
      "Curso voltado para a compreensão do processo de perícia médica previdenciária, preparação do cliente e estratégias de atuação do advogado.",
    professor: "Profa. Camila Reis",
    professorRole: "Médica Perita e Advogada",
    workload: "24 horas",
    totalLessons: 5,
    progress: 0,
    status: "nao-iniciado",
    category: "Direito Previdenciário",
    thumbnail: "/courses/pericia-medica.png",
    modules: [
      {
        id: "pm-mod1",
        title: "Introdução à Perícia",
        lessons: [
          {
            id: "pm-l1",
            title: "O Papel da Perícia Médica",
            duration: "18 min",
            completed: false,
            description: "Entenda a função e a importância da perícia médica.",
            videoUrl: "",
          },
          {
            id: "pm-l2",
            title: "Preparação do Cliente",
            duration: "20 min",
            completed: false,
            description: "Como orientar o cliente antes da perícia.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
]

export const inPersonCourses: InPersonCourse[] = [
  {
    id: "acidente-trabalho",
    title: "Acidente de Trabalho",
    city: "Florianópolis",
    state: "SC",
    month: "Mar",
    year: "2026",
    status: "em-andamento",
    track: "Curso presencial",
    progress: 50,
    completedLessons: 1,
    totalLessons: 2,
  },
  {
    id: "teses-revisionais",
    title: "Imersão em Teses Revisionais",
    city: "Florianópolis",
    state: "SC",
    month: "Mai",
    year: "2026",
    status: "em-andamento",
    track: "Curso presencial",
    progress: 50,
    completedLessons: 1,
    totalLessons: 2,
  },
  {
    id: "processo-judicial-previdenciario",
    title: "Imersão em Processo Judicial Previdenciário",
    city: "Curitiba",
    state: "PR",
    month: "Jul",
    year: "2026",
    status: "em-breve",
    track: "Curso presencial",
    availableLabel: "Disponível em Jul 2026",
  },
  {
    id: "recurso-extraordinario",
    title: "Imersão Prática em Recurso Extraordinário",
    city: "São Paulo",
    state: "SP",
    month: "Set",
    year: "2026",
    status: "em-breve",
    track: "Curso presencial",
    availableLabel: "Disponível em Set 2026",
  },
  {
    id: "mandado-seguranca-imersao",
    title: "Imersão em Mandado de Segurança",
    city: "Florianópolis",
    state: "SC",
    month: "Nov",
    year: "2026",
    status: "em-breve",
    track: "Curso presencial",
    availableLabel: "Disponível em Nov 2026",
  },
]

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    courseTitle: "Gestão de Escritórios de Advocacia",
    issueDate: "12/03/2026",
    status: "emitido",
    hours: "30 horas",
  },
  {
    id: "cert-2",
    courseTitle: "Direito Previdenciário Básico",
    issueDate: "28/11/2025",
    status: "emitido",
    hours: "60 horas",
  },
  {
    id: "cert-3",
    courseTitle: "Mandado de Segurança Previdenciário",
    issueDate: "—",
    status: "pendente",
    hours: "40 horas",
  },
]

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Aula ao vivo: Liminares em MS", date: "2026-06-12", type: "aula" },
  { id: "ev2", title: "Prova: Estruturando a Impetração", date: "2026-06-18", type: "prova" },
  { id: "ev3", title: "Aula ao vivo: Trâmite Processual", date: "2026-06-22", type: "aula" },
  { id: "ev4", title: "PrevSummit Internacional", date: "2026-06-25", type: "evento" },
  { id: "ev5", title: "Sunset Prev", date: "2026-06-26", type: "evento" },
  { id: "ev6", title: "Prova Final: Gestão", date: "2026-06-30", type: "prova" },
  { id: "ev7", title: "Aula: Comunicação Assertiva", date: "2026-06-15", type: "aula" },
]

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    author: "Fernanda Lima",
    avatarInitials: "FL",
    category: "Direito Previdenciário",
    timeAgo: "há 2 horas",
    title: "Alguém já conseguiu liminar em MS contra demora do INSS?",
    content:
      "Estou estruturando minha primeira impetração após o curso do Prof. Marco Serau e queria trocar experiências sobre os fundamentos que mais funcionaram na prática.",
    likes: 42,
    comments: [
      {
        id: "c1",
        author: "João Pedro",
        avatarInitials: "JP",
        timeAgo: "há 1 hora",
        content: "Consegui sim! O segredo foi comprovar bem a demora excessiva com o protocolo e o tempo de análise.",
        likes: 12,
      },
      {
        id: "c2",
        author: "Carla Mendes",
        avatarInitials: "CM",
        timeAgo: "há 45 min",
        content: "Aqui a liminar saiu em uma semana. Documentação organizada faz toda diferença.",
        likes: 8,
      },
    ],
  },
  {
    id: "post-2",
    author: "Rafael Souza",
    avatarInitials: "RS",
    category: "Gestão",
    timeAgo: "há 5 horas",
    title: "Quais indicadores vocês acompanham no escritório?",
    content:
      "Depois do curso de gestão comecei a medir taxa de conversão e prazo médio. Quais KPIs vocês consideram essenciais?",
    likes: 28,
    comments: [
      {
        id: "c3",
        author: "Beatriz Rocha",
        avatarInitials: "BR",
        timeAgo: "há 3 horas",
        content: "Ticket médio e custo de aquisição de cliente são fundamentais aqui.",
        likes: 5,
      },
    ],
  },
  {
    id: "post-3",
    author: "Lucas Andrade",
    avatarInitials: "LA",
    category: "Desenvolvimento Pessoal",
    timeAgo: "há 1 dia",
    title: "Como vocês lidam com a pressão dos prazos?",
    content:
      "O módulo de gestão do estresse mudou minha rotina. Compartilho aqui que blocos de foco de 50 minutos me ajudaram muito.",
    likes: 67,
    comments: [],
  },
  {
    id: "post-4",
    author: "Patrícia Gomes",
    avatarInitials: "PG",
    category: "Eventos",
    timeAgo: "há 2 dias",
    title: "Quem vai ao PrevSummit Internacional este ano?",
    content: "Vamos combinar um encontro da comunidade ESC durante o evento em Florianópolis!",
    likes: 91,
    comments: [
      {
        id: "c4",
        author: "Marina Castro",
        avatarInitials: "MC",
        timeAgo: "há 1 dia",
        content: "Eu vou! Seria ótimo conhecer pessoalmente.",
        likes: 14,
      },
    ],
  },
]

export const communityCategories = [
  "Todos",
  "Direito Previdenciário",
  "Gestão",
  "Desenvolvimento Pessoal",
  "Eventos",
]

export function getCourse(id: string) {
  return courses.find((c) => c.id === id)
}

export function getExam(examId: string) {
  for (const course of courses) {
    for (const mod of course.modules) {
      if (mod.exam?.id === examId) {
        return { course, module: mod, exam: mod.exam }
      }
    }
  }
  return undefined
}

export function getLessonContext(courseId: string, lessonId: string) {
  const course = getCourse(courseId)
  if (!course) return undefined
  const flat: { lesson: Lesson; moduleTitle: string }[] = []
  course.modules.forEach((m) => m.lessons.forEach((l) => flat.push({ lesson: l, moduleTitle: m.title })))
  const index = flat.findIndex((f) => f.lesson.id === lessonId)
  if (index === -1) return undefined
  return {
    course,
    current: flat[index],
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  }
}
