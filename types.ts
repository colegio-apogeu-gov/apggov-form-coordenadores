// types.ts
export type RatingOption = {
  value: 1 | 2 | 3 | 4;
  label: string;
  description: string;
};

export type DevelopmentField = {
  label: string;
  type: 'text';
};

export type CompetenciaBlock = {
  title: string;
  question: string;
  options: RatingOption[];
  development_actions: DevelopmentField;
};

export type CompetenciaKey =
  | 'integridade_responsabilidade_publica'
  | 'promocao_cultura_organizacional'
  | 'gestao_administrativa_organizacional'
  | 'gestao_pessoas_relacionamento_intersetorial'
  | 'comunicacao_relacionamento_institucional'
  | 'tomada_decisao_analise_dados'
  | 'gestao_compras_orcamento'
  | 'gestao_infraestrutura_servicos'
  | 'controle_assiduidade_carga_horaria'
  | 'articulacao_pedagogica_resultados';

export const RATING_DESCRIPTIONS: Record<CompetenciaKey, CompetenciaBlock> = {
  integridade_responsabilidade_publica: {
    title: 'Integridade e Responsabilidade Pública',
    question:
      'Como você avalia a capacidade do colaborador de agir com ética, cumprir normas e assegurar transparência nas suas ações?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Cumpre orientações e demonstra compromisso ético.' },
      { value: 2, label: 'Consolidando práticas', description: 'Aplica regras e normas com coerência e zelo.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Garante transparência nas ações e registros sob sua gestão.' },
      { value: 4, label: 'Estratégico / Referência', description: 'Inspira conduta ética e consolida a cultura de integridade institucional.' },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  promocao_cultura_organizacional: {
    title: 'Promoção da Cultura Organizacional',
    question:
      'Como você avalia a capacidade do colaborador de viver e multiplicar os valores, princípios e práticas organizacionais?',
    options: [
      {
        value: 1,
        label: 'Em desenvolvimento',
        description:
          'Demonstra compreensão inicial dos valores institucionais e busca orientação para aplicá-los nas rotinas de trabalho.',
      },
      {
        value: 2,
        label: 'Consolidando práticas',
        description:
          'Aplica os valores e princípios do APG GOV nas interações diárias e nas decisões cotidianas.',
      },
      {
        value: 3,
        label: 'Avançado / Autônomo',
        description:
          'Engaja colegas e equipes na vivência dos princípios culturais, participa ativamente dos rituais e iniciativas.',
      },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description:
          'É referência em coerência cultural, inspira e orienta equipes na prática dos valores institucionais.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  gestao_administrativa_organizacional: {
    title: 'Gestão Administrativa e Organizacional',
    question:
      'Como você avalia a capacidade do colaborador de garantir a execução das rotinas administrativas e organizacionais de forma eficaz?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Demonstra esforço em seguir rotinas com apoio.' },
      { value: 2, label: 'Consolidando práticas', description: 'Cumpre prazos e registra corretamente as demandas administrativas.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Organiza processos de forma autônoma e confiável.' },
      { value: 4, label: 'Estratégico / Referência', description: 'Estrutura sistemas que otimizam e garantem rastreabilidade das rotinas.' },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  gestao_pessoas_relacionamento_intersetorial: {
    title: 'Gestão de Pessoas e Relacionamento Intersetorial',
    question:
      'Como você avalia a capacidade do colaborador de conduzir equipes com clareza e empatia, promovendo colaboração entre setores?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Demonstra respeito e busca apoio para conduzir a equipe.' },
      { value: 2, label: 'Consolidando práticas', description: 'Aplica práticas de liderança com diálogo e coerência.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Engaja equipes e estimula colaboração intersetorial.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description: 'Inspira e forma lideranças, promovendo cultura de cooperação entre áreas.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  comunicacao_relacionamento_institucional: {
    title: 'Comunicação e Relacionamento Institucional',
    question:
      'Como você avalia a capacidade do colaborador de manter alinhamento com regionais, órgãos públicos e outros parceiros institucionais?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Comunica-se de forma cordial e pontual.' },
      { value: 2, label: 'Consolidando práticas', description: 'Transmite informações com clareza e responsabilidade.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Mantém relacionamento construtivo com parceiros institucionais.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description: 'Representa a instituição com credibilidade e promove integração entre redes.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  tomada_decisao_analise_dados: {
    title: 'Tomada de Decisão e Análise de Dados',
    question:
      'Como você avalia a capacidade do colaborador de ler indicadores e tomar decisões baseadas em evidências?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Analisa informações básicas com orientação.' },
      { value: 2, label: 'Consolidando práticas', description: 'Utiliza dados disponíveis para decisões cotidianas.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Interpreta indicadores e propõe ajustes assertivos.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description: 'Orienta decisões estratégicas com base em evidências complexas.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  gestao_compras_orcamento: {
    title: 'Gestão de Compras e Orçamento',
    question:
      'Como você avalia a capacidade do colaborador de garantir transparência e eficiência nos processos de compras e uso de recursos?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Segue fluxos de compra com supervisão.' },
      { value: 2, label: 'Consolidando práticas', description: 'Aplica corretamente os procedimentos e presta contas.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Monitora orçamentos e assegura economicidade.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description: 'Planeja e orienta decisões financeiras com visão institucional.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  gestao_infraestrutura_servicos: {
    title: 'Gestão de Infraestrutura e Serviços',
    question:
      'Como você avalia a capacidade do colaborador de coordenar manutenção e serviços, garantindo qualidade e cumprimento de prazos?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Cumpre orientações sobre manutenção e serviços.' },
      { value: 2, label: 'Consolidando práticas', description: 'Acompanha rotinas e comunica falhas com clareza.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Garante qualidade e cronogramas de execução.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description: 'Planeja melhorias estruturais e previne riscos operacionais.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  controle_assiduidade_carga_horaria: {
    title: 'Controle de Assiduidade e Carga Horária',
    question:
      'Como você avalia a capacidade do colaborador de monitorar a frequência e jornada de trabalho, assegurando conformidade?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Registra e confere presença com apoio.' },
      { value: 2, label: 'Consolidando práticas', description: 'Monitora frequência e comunica inconsistências.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Controla escalas e ajusta jornada conforme normas.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description:
          'Analisa padrões e propõe soluções para otimização da assiduidade.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
  articulacao_pedagogica_resultados: {
    title: 'Articulação Pedagógica para Resultados',
    question:
      'Como você avalia a capacidade do colaborador de conectar gestão administrativa aos resultados educacionais?',
    options: [
      { value: 1, label: 'Em desenvolvimento', description: 'Compreende os indicadores pedagógicos básicos.' },
      { value: 2, label: 'Consolidando práticas', description: 'Colabora com a equipe pedagógica nas ações diárias.' },
      { value: 3, label: 'Avançado / Autônomo', description: 'Integra dados administrativos aos resultados escolares.' },
      {
        value: 4,
        label: 'Estratégico / Referência',
        description:
          'Atua estrategicamente para fortalecer os resultados educacionais da rede.',
      },
    ],
    development_actions: { label: 'Ações de Desenvolvimento', type: 'text' },
  },
};

// ===== Tipos auxiliares de domínio =====
export type Coordenador = {
  regional: string;
  cadastro: string; // manter como string no front
  nome: string;
  admissao: string | null;
  cpf: string | null;
  cargo: string | null;
  local: string | null;
  escola: string | null;
  horas_mes: string | null;
  horas_semana: string | null;
  tempo_casa_meses?: string | null;
  total_carga_horaria_acumulada?: string | null;
  horas_faltas_injustificadas?: string | null;
  perc_faltas_injustificadas?: string | null;
};

// payload base (identificação do avaliado + contexto)
export type AvaliacaoBase = {
  unidade: string; // escola selecionada
  regional: string;
  cadastro: string;
  nome: string;
  admissao: string | null;
  cpf: string | null;
  cargo: string | null;
  local: string | null;
  escola: string | null;
  horas_mes: string | null;
  horas_semana: string | null;
  tempo_casa_meses?: string | null;
  total_carga_horaria_acumulada?: string | null;
  horas_faltas_injustificadas?: string | null;
  perc_faltas_injustificadas?: string | null;
};

// guarda nota e ação de desenvolvimento por competência
export type CompetenciaResposta = {
  avaliacao: 1 | 2 | 3 | 4;
  acoes_desenvolvimento?: string;
};

// shape do formulário completo
export type FormState = {
  base?: AvaliacaoBase;
  competencias: Partial<Record<CompetenciaKey, CompetenciaResposta>>;
};
