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
  thumbnail: string
  id: string
  title: string
  city: string
  state: string
  date: string
  local: string
  month: string
  year: string
  status: "em-andamento" | "em-breve"
  track: string
  area?: string
  professors?: string[]
  shortDescription?: string
  description?: string
  duration?: string
  methodology?: string[]
  demoLesson?: Lesson
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
  planDetails: "Plano ativo • acesso vitalício",
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

export const freeCourses: Course[] = [
  {
    id: "marketing-juridico",
    title: "Marketing Jurídico",
    shortDescription: "Posicionamento digital, autoridade e captação ética para advogados.",
    description:
      "Posicionamento digital, autoridade e captação ética para advogados. Aprenda a estruturar presença, conteúdo e estratégia com consistência.",
    professor: "Instituto ESC",
    professorRole: "Curso livre",
    workload: "58 min",
    totalLessons: 3,
    progress: 33,
    status: "em-andamento",
    category: "Curso livre",
    thumbnail: "/courses/gestao-escritorio.png",
    modules: [
      {
        id: "mj-mod1",
        title: "Fundamentos de marketing",
        lessons: [
          {
            id: "mj-l1",
            title: "Posicionamento e proposta de valor",
            duration: "18 min",
            completed: true,
            description: "Defina posicionamento, proposta de valor e diferenciais para sua atuação.",
            videoUrl: "",
          },
          {
            id: "mj-l2",
            title: "Conteúdo que gera autoridade",
            duration: "21 min",
            completed: false,
            description: "Planeje conteúdos que reforcem sua autoridade de forma estratégica.",
            videoUrl: "",
          },
          {
            id: "mj-l3",
            title: "Captação ética e relacionamento",
            duration: "19 min",
            completed: false,
            description: "Estruture uma rotina ética para captar, nutrir e converter oportunidades.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "produtividade-juridica",
    title: "Produtividade Jurídica",
    shortDescription: "Rotina, organização e eficiência para ganhar escala sem perder qualidade.",
    description:
      "Rotina, organização e eficiência para ganhar escala sem perder qualidade. Organize processos, elimine gargalos e aumente previsibilidade.",
    professor: "Instituto ESC",
    professorRole: "Curso livre",
    workload: "42 min",
    totalLessons: 3,
    progress: 0,
    status: "nao-iniciado",
    category: "Curso livre",
    thumbnail: "/courses/inteligencia-emocional.png",
    modules: [
      {
        id: "pj-mod1",
        title: "Produtividade aplicada",
        lessons: [
          {
            id: "pj-l1",
            title: "Planejamento semanal do escritório",
            duration: "14 min",
            completed: false,
            description: "Monte uma rotina semanal simples para organizar entregas e prioridades.",
            videoUrl: "",
          },
          {
            id: "pj-l2",
            title: "Padronização de tarefas repetitivas",
            duration: "13 min",
            completed: false,
            description: "Padronize tarefas recorrentes para reduzir retrabalho na operação.",
            videoUrl: "",
          },
          {
            id: "pj-l3",
            title: "Indicadores para acompanhar execução",
            duration: "15 min",
            completed: false,
            description: "Acompanhe execução com indicadores práticos e objetivos.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
  {
    id: "atendimento-humanizado",
    title: "Atendimento Humanizado",
    shortDescription: "Experiência do cliente, escuta ativa e comunicação clara no jurídico.",
    description:
      "Experiência do cliente, escuta ativa e comunicação clara no jurídico. Aprenda a conduzir atendimentos mais seguros e empáticos.",
    professor: "Instituto ESC",
    professorRole: "Curso livre",
    workload: "36 min",
    totalLessons: 3,
    progress: 100,
    status: "concluido",
    category: "Curso livre",
    thumbnail: "/courses/pericia-medica.png",
    modules: [
      {
        id: "ah-mod1",
        title: "Atendimento e experiência",
        lessons: [
          {
            id: "ah-l1",
            title: "Escuta ativa no primeiro contato",
            duration: "12 min",
            completed: true,
            description: "Conduza o primeiro atendimento com mais clareza, empatia e direção.",
            videoUrl: "",
          },
          {
            id: "ah-l2",
            title: "Comunicação simples e segura",
            duration: "11 min",
            completed: true,
            description: "Explique etapas, riscos e expectativas com objetividade.",
            videoUrl: "",
          },
          {
            id: "ah-l3",
            title: "Pós-atendimento e fidelização",
            duration: "13 min",
            completed: true,
            description: "Fortaleça o relacionamento com ações simples de acompanhamento.",
            videoUrl: "",
          },
        ],
      },
    ],
  },
]

export const inPersonCourses: InPersonCourse[] = [
  {
    thumbnail: "/cursos%20presenciais/acidente%20de%20trabalho.png",
    id: "acidente-trabalho",
    title: "PPP e LTCAT na Aposentadoria Especial: Obtenção, Retificação e Impactos dos EPIs na Comprovação do Tempo Especial",
    city: "Florianópolis",
    state: "SC",
    date: "10 e 11/07/2026",
    local: "Hotel Castelmar - FLORIANÓPOLIS/SC",
    month: "Mar",
    year: "2026",
    status: "em-andamento",
    track: "Curso presencial",
    area: "Direito do Trabalho e Direito Previdenciário ",
    professors: ["Carlos Alberto Pereira de Castro", "João Batista Lazzari"],
    shortDescription: "Aula demonstrativa",
    description:
      "O curso examina, de forma prática e atualizada, o papel do PPP e do LTCAT na comprovação do tempo especial para fins de aposentadoria especial, abordando tanto os aspectos trabalhistas quanto previdenciários envolvidos na produção e utilização dessa prova técnica.\nSerão analisados os caminhos jurídicos para obtenção, retificação e impugnação do PPP, inclusive por meio de ação na Justiça do Trabalho, bem como os reflexos desses documentos no reconhecimento do tempo especial perante o INSS e no processo judicial previdenciário. O curso também examina a jurisprudência recente dos Tribunais Superiores sobre a eficácia dos Equipamentos de Proteção Individual (EPIs), com destaque para os precedentes vinculantes do STF e do STJ.\nA partir da experiência dos professores e da análise de casos concretos e estratégias processuais, os participantes terão contato com técnicas de atuação profissional voltadas à construção da prova do tempo especial e à condução de demandas previdenciárias envolvendo aposentadoria especial. Indicado para advogados, servidores públicos, peritos, contadores e estudantes que desejam aprofundar o conhecimento sobre prova técnica e litigância estratégica no campo do Direito Previdenciário.",
    duration: "11 horas",
    methodology: [
      `CONTEUDO PROGRAMATICO

PARTE I - Prof. Carlos Alberto Pereira de Castro
EMENTA: PPP/LTCAT: PRODUCAO DA PROVA E ASPECTOS TRABALHISTAS
1) Comprovacao da atividade especial: conceitos e fundamentos normativos
2) Prova pericial: modalidades (indireta, por similaridade e banco de laudos)
3) Acao na Justica do Trabalho para obtencao e retificacao do PPP e do LCTA:
a) Cabimento e fundamentos juridicos
b) Prazos e procedimento
c) Estrutura da peticao inicial
d) Producao de provas, com enfase na prova pericial
e) Efeitos da decisao judicial sobre o PPP e o LTCAT
4) Interferencia da Aposentadoria Especial no contrato de trabalho

PARTE II - Prof. Joao Batista Lazzari
EMENTA: TEMPO ESPECIAL: ASPECTOS PREVIDENCIARIOS
1) Reconhecimento do tempo especial e seus efeitos praticos
2) Jurisprudencia e evolucao normativa sobre o tema
3) Questoes controvertidas:
a) atividades perigosas STF Tema 1209 (vigilantes)
b) eletricitarios, frentistas, etc.
c) atividades penosas (motorista de onibus e de caminhao)
4) Equipamentos de Protecao Individual - EPIs na jurisprudencia previdenciaria:
a) STF Repercussao Geral Tema 555 do STF
b) STJ Repetitivo Tema 1090
c) TRF/4 IRDR Tema 15
d) TNU - Representativo de Controversia Tema 213
5) Estrategias processuais na acao previdenciaria para descaracterizar os efeitos do EPI a luz das teses fixadas no Tema 1090 do STJ

PARTE III - Professores Carlos Alberto de Castro e Joao Batista Lazzari
a) Casos concretos de obtencao e revisao de PPP na Justica do Trabalho
b) Casos concretos com analise de provas em Acoes Previdenciarias
c) Dicas na elaboracao das peticoes na Justica do Trabalho e na Justica Federal`,
    ],
    demoLesson: {
      id: "demo",
      title: "Abertura e orientações",
      duration: "10 min",
      completed: false,
      description:
        "Apresentação do curso presencial e orientações gerais sobre a experiência dentro da plataforma.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    progress: 0,
    completedLessons: 0,
    totalLessons: 1,
  },
  {
    thumbnail: "/cursos%20presenciais/imersao%20teses.png",
    id: "teses-revisionais",
    title: "PRÁTICA: MANDADO DE SEGURANÇA EM MATÉRIA PREVIDENCIÁRIA",
    city: "Florianópolis",
    state: "SC",
    date: "A previsão inicial é para que o curso ocorra das 9h às 18h, com paradas para intervalo e almoço.",
    local: "Hotel Castelmar - FLORIANÓPOLIS/SC",
    month: "Jul",
    year: "2026",
    status: "em-andamento",
    track: "Curso presencial",
    area: "Direito Previdenciário",
    professors: ["Marco Aurélio Serau Junior"],
    shortDescription: "Aula demonstrativa",
    description:
      `• Conceito
• Mandado de Segurança na Constituição Federal
• Direito líquido e certo
• Abuso de direito e ilegalidade
• Autoridade coatora
• Mandado de segurança individual e coletivo
• Mandado de segurança preventivo e repressivo
• Rito Processual (Lei 12.016/2009)
• Competência
• Liminar
• Hipóteses de não cabimento de mandado de segurança
• Recursos cabíveis
• Mandado de segurança nos Juizados Especiais Federais
• Jurisprudência do STF e STJ sobre mandado de segurança`,
    duration: "8 horas",
    methodology: [
      "Encaminhamento de material de leitura prévia aos alunos, para compreensão inicial da matéria.",
      "Exposição do conteúdo programático através da solução de casos concretos.",
    ],
    demoLesson: {
      id: "demo",
      title: "Abertura e orientações",
      duration: "10 min",
      completed: false,
      description:
        "Apresentação do curso presencial e orientações gerais sobre a experiência dentro da plataforma.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    progress: 0,
    completedLessons: 0,
    totalLessons: 1,
  },
  {
    thumbnail: "/cursos%20presenciais/imersao%20em%20processo.png",
    id: "processo-judicial-previdenciario",
    title: "PRÁTICA: TESES REVISIONAIS APLICÁVEIS AOS BENEFÍCIOS NÃO PROGRAMÁVEIS DO RGPS (BENEFÍCIOS POR INCAPACIDADE / PENSÃO POR MORTE) APÓS A REFORMA DA PREVIDÊNCIA (EC N. 103/2019)",
    city: "Curitiba",
    state: "PR",
    date: "10 e 11/07/2026",
    local: "Hotel Castelmar - FLORIANÓPOLIS/SC",
    month: "Jul",
    year: "2026",
    status: "em-breve",
    track: "Curso presencial",
    area: "Direito Previdenciário",
    professors: ["Lucas Alberton"],
    shortDescription: "Aula demonstrativa",
    description:
      `• Recálculo da Aposentadoria por Incapacidade Permanente / Pensão por Morte, pela técnica de descarte de contribuições
• O tempo de convivência do casal, seja de casamento, seja de união estável, com ou sem solução de continuidade na relação, como requisito para manutenção da pensão por morte no RGPS`,
    duration: "4 horas",
    methodology: [
      "Exposição do conteúdo programático através da solução de casos concretos.",
      "Encaminhamento de modelos das teses para aplicação na prática previdenciária.",
    ],
    demoLesson: {
      id: "demo",
      title: "Abertura e orientações",
      duration: "10 min",
      completed: false,
      description:
        "Apresentação do curso presencial e orientações gerais sobre a experiência dentro da plataforma.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    availableLabel: "Disponível em Jul 2026",
  },
  {
    thumbnail: "/cursos%20presenciais/imersao%20em%20mandado.png",
    id: "mandado-seguranca-imersao",
    title: "Aposentadoria Especial na Prática : Domine PPP, LTCAT e a Prova do Tempo Especial",
    city: "Florianópolis",
    state: "SC",
    date: "10 e 11/07/2026",
    local: "Hotel Castelmar - FLORIANÓPOLIS/SC",
    month: "Nov",
    year: "2026",
    status: "em-breve",
    track: "Curso presencial",
    area: "Direito Previdenciário",
    professors: ["Carlos Alberto Pereira de Castro", "João Batista Lazzari"],
    shortDescription: "Aula demonstrativa",
    description:
      `Grande parte das ações envolvendo aposentadoria especial não depende apenas da existência do direito, mas da qualidade da prova técnica apresentada.

Na prática profissional, são frequentes situações como:
• PPP incompleto ou preenchido incorretamente
• ausência ou inconsistência do LTCAT
• divergências quanto ao uso e à eficácia dos Equipamentos de Proteção Individual (EPIs)
• dificuldades na produção de prova pericial adequada

Esses problemas exigem do advogado uma atuação estratégica que envolve simultaneamente aspectos trabalhistas e previdenciários, bem como conhecimento da jurisprudência atual dos Tribunais Superiores.

Este curso foi estruturado para oferecer uma visão integrada e prática sobre a prova do tempo especial, permitindo ao profissional atuar com maior segurança na condução de demandas envolvendo aposentadoria especial.

O QUE VOCE VAI APRENDER
✔ fundamentos jurídicos da comprovação da atividade especial
✔ utilização técnica do PPP e do LTCAT na prova previdenciária
✔ estratégias para obtenção e retificação do PPP por meio de ação trabalhista
✔ modalidades de prova pericial aplicadas ao tempo especial
✔ interpretação da jurisprudência atual do STF, STJ e tribunais regionais
✔ discussão jurídica sobre eficácia dos EPIs
✔ estratégias processuais na condução de ações previdenciárias envolvendo aposentadoria especial

PARA QUEM ESTE CURSO E INDICADO
Este curso é direcionado a profissionais que atuam ou desejam atuar com aposentadoria especial, especialmente:
• advogados previdenciaristas
• advogados trabalhistas
• servidores públicos
• peritos judiciais
• contadores
• estudantes de Direito interessados no tema`,
    duration: "11 horas",
    methodology: [
      `Estrutura do Curso

Modulo 1
PPP e LTCAT: producao da prova e aspectos trabalhistas
Professor: Carlos Alberto Pereira de Castro
• fundamentos da comprovacao da atividade especial
• modalidades de prova pericial (direta, indireta e por similaridade)
• acao na Justica do Trabalho para obtencao ou retificacao do PPP
• fundamentos juridicos e cabimento da acao
• estrutura da peticao inicial
• producao de prova pericial
• efeitos da decisao judicial sobre PPP e LTCAT
• interferencia da aposentadoria especial no contrato de trabalho`,
      `Modulo 2
Tempo especial: aspectos previdenciarios
Professor: Joao Batista Lazzari
• reconhecimento do tempo especial e seus efeitos
• evolucao normativa e jurisprudencial
• atividades perigosas e penosas
• analise de categorias profissionais (vigilantes, eletricitarios, frentistas etc.)
Equipamentos de Protecao Individual na jurisprudencia previdenciaria:
• Tema 555 do STF
• Tema 1090 do STJ
• IRDR 15 do TRF4
• Tema 213 da TNU
• estrategias processuais para descaracterizacao da eficacia do EPI`,
      `Modulo 3
Oficina pratica
Atividade conduzida pelos dois professores com analise de situacoes concretas:
• casos reais de obtencao e revisao de PPP na Justica do Trabalho
• analise de prova tecnica em acoes previdenciarias
• orientacoes praticas para elaboracao de peticoes
• integracao entre estrategias trabalhistas e previdenciarias`,
    ],
    demoLesson: {
      id: "demo",
      title: "Abertura e orientações",
      duration: "10 min",
      completed: false,
      description:
        "Apresentação do curso presencial e orientações gerais sobre a experiência dentro da plataforma.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
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

function findCourse(collection: Course[], id: string) {
  return collection.find((course) => course.id === id)
}

function findExam(collection: Course[], examId: string) {
  for (const course of collection) {
    for (const mod of course.modules) {
      if (mod.exam?.id === examId) {
        return { course, module: mod, exam: mod.exam }
      }
    }
  }
  return undefined
}

function findLessonContext(collection: Course[], courseId: string, lessonId: string) {
  const course = findCourse(collection, courseId)
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

export function getCourse(id: string) {
  return findCourse(courses, id)
}

export function getFreeCourse(id: string) {
  return findCourse(freeCourses, id)
}

export function getExam(examId: string) {
  return findExam(courses, examId)
}

export function getFreeExam(examId: string) {
  return findExam(freeCourses, examId)
}

export function getLessonContext(courseId: string, lessonId: string) {
  return findLessonContext(courses, courseId, lessonId)
}

export function getFreeLessonContext(courseId: string, lessonId: string) {
  return findLessonContext(freeCourses, courseId, lessonId)
}

export function getInPersonCourse(id: string) {
  const inPerson = inPersonCourses.find((course) => course.id === id)
  if (!inPerson) return undefined

  const demoLesson: Lesson = {
    id: inPerson.demoLesson?.id ?? "demo",
    title: inPerson.demoLesson?.title ?? "Vídeo DEMO — demonstração",
    duration: inPerson.demoLesson?.duration ?? "10 min",
    completed: false,
    description:
      inPerson.demoLesson?.description ??
      "Assista a uma prévia do conteúdo para entender a experiência de aula dentro da plataforma.",
    videoUrl:
      inPerson.demoLesson?.videoUrl ??
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }

  const modulesWithCompletion: Module[] = [
    {
      id: `${inPerson.id}-demo`,
      title: "Vídeo DEMO",
      lessons: [demoLesson],
    },
  ]

  return {
    id: inPerson.id,
    title: inPerson.title,
    shortDescription: inPerson.shortDescription ?? "Aula demonstrativa",
    description:
      inPerson.description ??
      "Conteúdo de demonstração para a área de cursos presenciais. Este vídeo é apenas uma prévia.",
    professor: inPerson.professors?.join(", ") ?? "Instituto ESC",
    professorRole: inPerson.area ?? "Curso presencial",
    workload: inPerson.duration ?? "—",
    totalLessons: 1,
    progress: 0,
    status: inPerson.status === "em-andamento" ? "em-andamento" : ("nao-iniciado" as const),
    category: "Cursos presenciais",
    thumbnail: inPerson.thumbnail,
    modules: modulesWithCompletion,
  }
}

export function getInPersonLessonContext(courseId: string, lessonId: string) {
  const course = getInPersonCourse(courseId)
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
