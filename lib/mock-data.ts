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
    id: "comercial",
    title: "Comercial",
    shortDescription: "Aquisição, qualificação e conversão de clientes previdenciários.",
    description:
      "Aquisição, qualificação e conversão de clientes previdenciários. Do posicionamento ao fechamento, com foco em um funil claro e replicável.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "1h 10min",
    totalLessons: 4,
    progress: 50,
    status: "em-andamento",
    category: "Formação online",
    thumbnail: "/courses/gestao-escritorio.png",
    modules: [
      {
        id: "com-mod1",
        title: "Comercial",
        lessons: [
          {
            id: "com-l1",
            title: "Posicionamento e nicho previdenciário",
            duration: "14 min",
            completed: true,
            description:
              "Defina posicionamento e nicho para atrair o cliente certo e aumentar conversões.",
            videoUrl: "",
          },
          {
            id: "com-l2",
            title: "Funil de aquisição que converte",
            duration: "22 min",
            completed: true,
            description: "Estruture um funil simples e previsível para aquisição de clientes.",
            videoUrl: "",
          },
          {
            id: "com-l3",
            title: "Atendimento e qualificação do lead",
            duration: "18 min",
            completed: false,
            description: "Como conduzir o atendimento e qualificar leads com critérios claros.",
            videoUrl: "",
          },
          {
            id: "com-l4",
            title: "Honorários e proposta de valor",
            duration: "16 min",
            completed: false,
            description: "Construa uma proposta de valor e um modelo de honorários sustentáveis.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "saneamento",
    title: "Saneamento",
    shortDescription: "Organização documental, triagem inteligente e preparação do caso.",
    description:
      "Organização documental, triagem inteligente e preparação do caso. Padronize o fluxo de entrada e acelere decisões com consistência.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "46 min",
    totalLessons: 3,
    progress: 100,
    status: "concluido",
    category: "Formação online",
    thumbnail: "/courses/pericia-medica.png",
    modules: [
      {
        id: "san-mod1",
        title: "Saneamento",
        lessons: [
          {
            id: "san-l1",
            title: "Checklist de documentos essenciais",
            duration: "12 min",
            completed: true,
            description: "Monte um checklist objetivo para garantir entrada completa de documentos.",
            videoUrl: "",
          },
          {
            id: "san-l2",
            title: "Análise preliminar com foco em viabilidade",
            duration: "19 min",
            completed: true,
            description: "Faça uma triagem inicial rápida para decidir viabilidade e próximos passos.",
            videoUrl: "",
          },
          {
            id: "san-l3",
            title: "Padronização do fluxo de entrada",
            duration: "15 min",
            completed: true,
            description: "Padronize o fluxo para reduzir retrabalho e melhorar previsibilidade.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "judicial",
    title: "Judicial",
    shortDescription: "Construção da estratégia processual com foco em resultado e escala.",
    description:
      "Construção da estratégia processual com foco em resultado e escala. Da tese central ao acompanhamento, com rotina de execução.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "1h 01min",
    totalLessons: 3,
    progress: 33,
    status: "em-andamento",
    category: "Formação online",
    thumbnail: "/courses/mandado-seguranca.png",
    modules: [
      {
        id: "jud-mod1",
        title: "Judicial",
        lessons: [
          {
            id: "jud-l1",
            title: "Montagem da tese central",
            duration: "20 min",
            completed: true,
            description: "Construa a tese central com clareza e consistência para o caso.",
            videoUrl: "",
          },
          {
            id: "jud-l2",
            title: "Petição inicial com repertório probatório",
            duration: "24 min",
            completed: false,
            description: "Estruture a inicial com provas e repertório para aumentar previsibilidade.",
            videoUrl: "",
          },
          {
            id: "jud-l3",
            title: "Acompanhamento estratégico do processo",
            duration: "17 min",
            completed: false,
            description: "Crie um roteiro de acompanhamento para decisões e movimentações.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "tecnologia",
    title: "Tecnologia",
    shortDescription: "Ferramentas, automações e produtividade aplicada ao escritório.",
    description:
      "Ferramentas, automações e produtividade aplicada ao escritório. Estruture o operacional digital, automatize rotinas e use IA com pragmatismo.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "52 min",
    totalLessons: 3,
    progress: 0,
    status: "nao-iniciado",
    category: "Formação online",
    thumbnail: "/courses/inteligencia-emocional.png",
    modules: [
      {
        id: "tec-mod1",
        title: "Tecnologia",
        lessons: [
          {
            id: "tec-l1",
            title: "Estrutura digital do operacional",
            duration: "13 min",
            completed: false,
            description: "Monte uma estrutura digital simples para organizar o operacional.",
            videoUrl: "",
          },
          {
            id: "tec-l2",
            title: "Automação de tarefas recorrentes",
            duration: "21 min",
            completed: false,
            description: "Automatize rotinas para reduzir retrabalho e ganhar escala.",
            videoUrl: "",
          },
          {
            id: "tec-l3",
            title: "Uso prático de IA na rotina",
            duration: "18 min",
            completed: false,
            description: "Aplique IA em tarefas do dia a dia com foco em produtividade.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "financeiro",
    title: "Financeiro",
    shortDescription: "Precificação, previsibilidade e leitura financeira da operação.",
    description:
      "Precificação, previsibilidade e leitura financeira da operação. Entenda receita, indicadores e margens para decisões melhores.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "45 min",
    totalLessons: 3,
    progress: 0,
    status: "nao-iniciado",
    category: "Formação online",
    thumbnail: "/placeholder.svg",
    modules: [
      {
        id: "fin-mod1",
        title: "Financeiro",
        lessons: [
          {
            id: "fin-l1",
            title: "Modelo de receita por carteira",
            duration: "15 min",
            completed: false,
            description: "Estruture um modelo de receita por carteira e acompanhe evolução.",
            videoUrl: "",
          },
          {
            id: "fin-l2",
            title: "Controle de indicadores-chave",
            duration: "16 min",
            completed: false,
            description: "Defina e acompanhe indicadores para medir a saúde da operação.",
            videoUrl: "",
          },
          {
            id: "fin-l3",
            title: "Margem, fluxo e expansão",
            duration: "14 min",
            completed: false,
            description: "Organize margem e fluxo para crescer com segurança.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "inteligencia-artificial",
    title: "Inteligência Artificial",
    shortDescription: "Aplicações reais de IA para acelerar análise, conteúdo e decisão.",
    description:
      "Aplicações reais de IA para acelerar análise, conteúdo e decisão. Do prompt ao fluxo assistido, com foco em escala e padronização.",
    professor: "Instituto ESC",
    professorRole: "Formação ESC",
    workload: "47 min",
    totalLessons: 3,
    progress: 0,
    status: "nao-iniciado",
    category: "Formação online",
    thumbnail: "/placeholder.svg",
    modules: [
      {
        id: "ia-mod1",
        title: "Inteligência Artificial",
        lessons: [
          {
            id: "ia-l1",
            title: "Prompts para produtividade jurídica",
            duration: "11 min",
            completed: false,
            description: "Crie prompts que economizam tempo em tarefas repetitivas.",
            videoUrl: "",
          },
          {
            id: "ia-l2",
            title: "Apoio à análise de casos e documentos",
            duration: "19 min",
            completed: false,
            description: "Use IA para acelerar leitura e organização de informações do caso.",
            videoUrl: "",
          },
          {
            id: "ia-l3",
            title: "Fluxos assistidos para escala",
            duration: "17 min",
            completed: false,
            description: "Desenhe fluxos assistidos para padronizar entregas e ganhar escala.",
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
    courseTitle: "Saneamento",
    issueDate: "12/03/2026",
    status: "emitido",
    hours: "46 min",
  },
  {
    id: "cert-2",
    courseTitle: "Comercial",
    issueDate: "28/11/2025",
    status: "emitido",
    hours: "1h 10min",
  },
  {
    id: "cert-3",
    courseTitle: "Judicial",
    issueDate: "—",
    status: "pendente",
    hours: "1h 01min",
  },
]

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Aula ao vivo: Funil de aquisição que converte", date: "2026-06-12", type: "aula" },
  { id: "ev2", title: "Prova: Comercial", date: "2026-06-18", type: "prova" },
  { id: "ev3", title: "Aula ao vivo: Montagem da tese central", date: "2026-06-22", type: "aula" },
  { id: "ev4", title: "PrevSummit Internacional", date: "2026-06-25", type: "evento" },
  { id: "ev5", title: "Sunset Prev", date: "2026-06-26", type: "evento" },
  { id: "ev6", title: "Prova: Saneamento", date: "2026-06-30", type: "prova" },
  { id: "ev7", title: "Aula: Uso prático de IA na rotina", date: "2026-06-15", type: "aula" },
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
