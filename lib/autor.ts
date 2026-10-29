// Tudo o que identifica o autor e o site. Alterar aqui muda o site inteiro.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nemambo.com").replace(/\/$/, "");

export const autor = {
  nome: "Pedro Nemambo",
  nomeCompleto: "Pedro Bartolomeu Domingos Nemambo",
  funcao: "Jornalista, comunicador e autor",
  frase: "Comunicação, instituições e a Angola que se constrói todos os dias.",
  resumo:
    "Jornalista e mestre em Ciência Política e Administração Pública. Chefe de Comunicação do CPL SPCB, coach, editor de conteúdos jornalísticos e autor do livro «Contributo da Comunicação».",
  foto: "/img/pedro-nemambo.webp",
  nascimento: "1989-05-25",
  naturalidade: "Nzeto, província do Zaire",
  pais: "Filho de Bartolomeu Domingos Nemambo e de Joaquina Domingos João",
  linguas: ["Português", "Kikongo"],
  formacao: [
    { grau: "Mestrado em Ciência Política e Administração Pública", escola: "Universidade Agostinho Neto (UAN)" },
    { grau: "Pós-graduação em Agregação Pedagógica", escola: "Universidade Óscar Ribas (UOR)" },
    { grau: "Licenciatura em Comunicação Social", escola: "Instituto Superior de Angola (ISA)" },
  ],
  percurso: [
    { titulo: "Chefe de Comunicação do CPL SPCB", texto: "Funcionário público, responsável pela comunicação institucional." },
    { titulo: "Sócio da NK Luzindalalu", texto: "Um dos sócios da empresa." },
    { titulo: "Gestor e editor de conteúdos jornalísticos", texto: "Planeamento, edição e revisão de conteúdos para imprensa e instituições." },
    { titulo: "Coach", texto: "Acompanhamento de pessoas e equipas no seu desenvolvimento." },
    { titulo: "Orientador académico", texto: "Orientação de trabalhos académicos, monografias e dissertações." },
  ],
  servicos: [
    { titulo: "Orientação de trabalhos académicos", texto: "Monografias, dissertações e trabalhos de fim de curso: do tema à defesa, com método e rigor." },
    { titulo: "Comunicação institucional", texto: "Gestão e edição de conteúdos jornalísticos e estratégias de comunicação para instituições." },
    { titulo: "Coaching", texto: "Sessões para quem quer clareza, foco e um plano concreto para crescer." },
  ],
};

export const CATEGORIAS = [
  { id: "artigos", nome: "Artigos", plural: "Artigos", desc: "Análises sobre comunicação, administração pública e sociedade." },
  { id: "ideias", nome: "Ideias", plural: "Ideias", desc: "Propostas e reflexões para pensar Angola e as suas instituições." },
  { id: "opinioes", nome: "Opinião", plural: "Opinião", desc: "Posições claras sobre os temas do momento." },
] as const;

export const nomeCategoria = (id: string) => CATEGORIAS.find((c) => c.id === id)?.nome ?? "Artigos";
