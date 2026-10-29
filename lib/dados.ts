// Leituras públicas (servidor e browser). Só devolvem o que está publicado/activo (RLS).
import { supabase, supabaseConfigurado, STORE_SLUG } from "./supabase";
import type { Artigo, Definicoes, Livro } from "./tipos";

export const definicoesPadrao: Definicoes = { whatsapp: "", email: "", facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "" };

const CAMPOS_LISTA = "id,slug,titulo,resumo,capa,categoria,fixado,publicado,publicado_em,vistas,created_at,updated_at,conteudo";

export async function listarArtigos(op: { categoria?: string; limite?: number; excluir?: string } = {}): Promise<Artigo[]> {
  if (!supabaseConfigurado) return [];
  try {
    let q = supabase.from("nemambo_artigos").select(CAMPOS_LISTA).eq("publicado", true).order("publicado_em", { ascending: false });
    if (op.categoria) q = q.eq("categoria", op.categoria);
    if (op.excluir) q = q.neq("id", op.excluir);
    q = q.limit(op.limite ?? 60);
    const { data } = await q;
    return (data ?? []) as Artigo[];
  } catch {
    return [];
  }
}

/** artigo que abre a página inicial: o fixado; se nenhum, o mais recente */
export async function artigoDestaque(): Promise<Artigo | null> {
  if (!supabaseConfigurado) return null;
  try {
    const { data } = await supabase.from("nemambo_artigos").select(CAMPOS_LISTA).eq("publicado", true).eq("fixado", true).order("publicado_em", { ascending: false }).limit(1);
    if (data?.length) return data[0] as Artigo;
    const r = await listarArtigos({ limite: 1 });
    return r[0] ?? null;
  } catch {
    return null;
  }
}

export async function obterArtigo(slug: string): Promise<Artigo | null> {
  if (!supabaseConfigurado) return null;
  try {
    const { data } = await supabase.from("nemambo_artigos").select("*").eq("slug", slug).eq("publicado", true).maybeSingle();
    return (data as Artigo) ?? null;
  } catch {
    return null;
  }
}

export async function listarLivros(): Promise<Livro[]> {
  if (!supabaseConfigurado) return [];
  try {
    const { data } = await supabase.from("nemambo_livros").select("*").eq("ativo", true).order("destaque", { ascending: false }).order("ordem").order("created_at", { ascending: false });
    return (data ?? []) as Livro[];
  } catch {
    return [];
  }
}

export async function obterLivro(slug: string): Promise<Livro | null> {
  if (!supabaseConfigurado) return null;
  try {
    const { data } = await supabase.from("nemambo_livros").select("*").eq("slug", slug).eq("ativo", true).maybeSingle();
    return (data as Livro) ?? null;
  } catch {
    return null;
  }
}

export async function obterStoreId(): Promise<string | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await supabase.from("stores").select("id").eq("slug", STORE_SLUG).maybeSingle();
  return data?.id ?? null;
}

export async function obterDefinicoes(): Promise<Definicoes> {
  if (!supabaseConfigurado) return definicoesPadrao;
  try {
    const id = await obterStoreId();
    if (!id) return definicoesPadrao;
    const { data } = await supabase.from("store_content").select("data").eq("store_id", id).maybeSingle();
    return { ...definicoesPadrao, ...((data?.data ?? {}) as Partial<Definicoes>) };
  } catch {
    return definicoesPadrao;
  }
}

// Acções públicas do visitante (funções seguras no Supabase)
export async function contarVista(slug: string) {
  if (!supabaseConfigurado) return;
  await supabase.rpc("nemambo_contar_vista", { p_slug: slug });
}

export async function contarClique(id: string) {
  if (!supabaseConfigurado) return;
  await supabase.rpc("nemambo_contar_clique", { p_id: id });
}

export async function subscrever(email: string, nome: string, origem: string): Promise<string | null> {
  if (!supabaseConfigurado) return "O site ainda não está ligado à base de dados.";
  const { error } = await supabase.rpc("nemambo_subscrever", { p_email: email, p_nome: nome, p_origem: origem });
  return error ? (error.message.includes("inválido") ? "Verifique o email." : "Não foi possível guardar. Tente de novo.") : null;
}
