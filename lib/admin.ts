// Operações do painel. Tudo é validado no Supabase (RLS): só o gerente do site consegue gravar.
import { supabase } from "./supabase";
import { obterStoreId } from "./dados";
import type { Artigo, Definicoes, Livro } from "./tipos";

export async function souGerente(): Promise<boolean> {
  const { data } = await supabase.rpc("nemambo_e_gerente");
  return data === true;
}

// Artigos ---------------------------------------------------------------
export async function todosArtigos(): Promise<Artigo[]> {
  const { data } = await supabase.from("nemambo_artigos").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Artigo[];
}

export async function umArtigo(id: string): Promise<Artigo | null> {
  const { data } = await supabase.from("nemambo_artigos").select("*").eq("id", id).maybeSingle();
  return (data as Artigo) ?? null;
}

export type ArtigoEdit = Pick<Artigo, "slug" | "titulo" | "resumo" | "conteudo" | "capa" | "categoria" | "fixado" | "publicado" | "publicado_em">;

export async function guardarArtigo(id: string | null, a: ArtigoEdit): Promise<{ id?: string; erro?: string }> {
  const dados = { ...a, publicado_em: a.publicado && !a.publicado_em ? new Date().toISOString() : a.publicado_em, updated_at: new Date().toISOString() };
  // só um artigo fica fixado na página inicial
  if (a.fixado) {
    let q = supabase.from("nemambo_artigos").update({ fixado: false }).eq("fixado", true);
    if (id) q = q.neq("id", id);
    await q;
  }
  const r = id
    ? await supabase.from("nemambo_artigos").update(dados).eq("id", id).select("id").single()
    : await supabase.from("nemambo_artigos").insert(dados).select("id").single();
  if (r.error) return { erro: r.error.message.includes("duplicate") ? "Já existe um artigo com este endereço (slug). Mude-o." : r.error.message };
  return { id: r.data.id };
}

export async function apagarArtigo(id: string) {
  const { error } = await supabase.from("nemambo_artigos").delete().eq("id", id);
  return error?.message ?? null;
}

// Livros ----------------------------------------------------------------
export async function todosLivros(): Promise<Livro[]> {
  const { data } = await supabase.from("nemambo_livros").select("*").order("ordem").order("created_at", { ascending: false });
  return (data ?? []) as Livro[];
}

export async function umLivro(id: string): Promise<Livro | null> {
  const { data } = await supabase.from("nemambo_livros").select("*").eq("id", id).maybeSingle();
  return (data as Livro) ?? null;
}

export type LivroEdit = Omit<Livro, "id" | "cliques" | "created_at">;

export async function guardarLivro(id: string | null, l: LivroEdit): Promise<{ id?: string; erro?: string }> {
  const r = id
    ? await supabase.from("nemambo_livros").update(l).eq("id", id).select("id").single()
    : await supabase.from("nemambo_livros").insert(l).select("id").single();
  if (r.error) return { erro: r.error.message.includes("duplicate") ? "Já existe um livro com este endereço (slug). Mude-o." : r.error.message };
  return { id: r.data.id };
}

export async function apagarLivro(id: string) {
  const { error } = await supabase.from("nemambo_livros").delete().eq("id", id);
  return error?.message ?? null;
}

// Leitores (newsletter) -------------------------------------------------
export type Leitor = { id: string; email: string; nome: string; origem: string; created_at: string };

export async function listarLeitores(): Promise<Leitor[]> {
  const { data } = await supabase.from("nemambo_leitores").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Leitor[];
}

export async function apagarLeitor(id: string) {
  const { error } = await supabase.from("nemambo_leitores").delete().eq("id", id);
  return error?.message ?? null;
}

// Definições ------------------------------------------------------------
export async function guardarDefinicoes(d: Definicoes): Promise<string | null> {
  const id = await obterStoreId();
  if (!id) return "Site não encontrado. Correu o ficheiro supabase/001_nemambo.sql?";
  const { data, error } = await supabase.from("store_content").update({ data: d, updated_at: new Date().toISOString() }).eq("store_id", id).select();
  if (error) return error.message;
  if (!data?.length) return "Sem permissão para guardar.";
  return null;
}
