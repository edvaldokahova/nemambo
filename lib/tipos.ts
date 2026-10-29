export type Artigo = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa: string;
  categoria: string;
  fixado: boolean;
  publicado: boolean;
  publicado_em: string | null;
  vistas: number;
  created_at: string;
  updated_at: string;
};

export type Livro = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  capa: string;
  preco_texto: string;
  link_compra: string;
  texto_botao: string;
  edicao: string;
  editora: string;
  paginas: string;
  isbn: string;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  cliques: number;
  created_at: string;
};

export type Definicoes = {
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
};
