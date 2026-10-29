"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bold, Heading2, ImageIcon, Italic, Link2, List, Quote, Trash2 } from "lucide-react";
import { apagarArtigo, guardarArtigo, umArtigo, type ArtigoEdit } from "@/lib/admin";
import { CATEGORIAS } from "@/lib/autor";
import { minutosLeitura, slugify } from "@/lib/formato";
import { Markdown } from "@/lib/markdown";
import { Interruptor, caixaAdm } from "@/components/admin/ui";

const vazio: ArtigoEdit = { slug: "", titulo: "", resumo: "", conteudo: "", capa: "", categoria: "artigos", fixado: false, publicado: false, publicado_em: null };

export default function EditarArtigo({ params }: { params: { id: string } }) {
  const novo = params.id === "novo";
  const router = useRouter();
  const [a, setA] = useState<ArtigoEdit>(vazio);
  const [slugManual, setSlugManual] = useState(false);
  const [carregado, setCarregado] = useState(novo);
  const [aba, setAba] = useState<"escrever" | "ver">("escrever");
  const [msg, setMsg] = useState("");
  const [aGuardar, setAGuardar] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (novo) return;
    umArtigo(params.id).then((r) => {
      if (r) { setA({ slug: r.slug, titulo: r.titulo, resumo: r.resumo, conteudo: r.conteudo, capa: r.capa, categoria: r.categoria, fixado: r.fixado, publicado: r.publicado, publicado_em: r.publicado_em }); setSlugManual(true); }
      setCarregado(true);
    });
  }, [novo, params.id]);

  const mudar = <K extends keyof ArtigoEdit>(k: K, v: ArtigoEdit[K]) => setA((x) => ({ ...x, [k]: v }));
  const mudarTitulo = (t: string) => setA((x) => ({ ...x, titulo: t, slug: slugManual ? x.slug : slugify(t) }));

  // Botões de formatação: envolvem o texto seleccionado
  const formatar = (antes: string, depois = "", exemplo = "texto", linha = false) => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: i, selectionEnd: f, value } = el;
    const sel = value.slice(i, f) || exemplo;
    const prefixo = linha && i > 0 && value[i - 1] !== "\n" ? "\n\n" : "";
    const novoTexto = value.slice(0, i) + prefixo + antes + sel + depois + value.slice(f);
    mudar("conteudo", novoTexto);
    requestAnimationFrame(() => { el.focus(); const p = i + prefixo.length + antes.length; el.setSelectionRange(p, p + sel.length); });
  };

  const guardar = async (publicar?: boolean) => {
    setMsg("");
    if (!a.titulo.trim()) return setMsg("Escreva um título.");
    if (!a.slug.trim()) return setMsg("Falta o endereço (slug).");
    const dados = { ...a, slug: slugify(a.slug), publicado: publicar ?? a.publicado };
    setAGuardar(true);
    const r = await guardarArtigo(novo ? null : params.id, dados);
    setAGuardar(false);
    if (r.erro) return setMsg(`Erro: ${r.erro}`);
    setA(dados);
    setMsg(dados.publicado ? "Guardado e publicado. No site aparece em até 1 minuto." : "Rascunho guardado.");
    if (novo && r.id) router.replace(`/admin/artigos/${r.id}`);
  };

  const apagar = async () => {
    if (!window.confirm("Apagar este artigo de vez?")) return;
    const e = await apagarArtigo(params.id);
    if (e) setMsg(`Erro: ${e}`); else router.replace("/admin/artigos");
  };

  if (!carregado) return <p className="text-[14px] text-texto/55">A carregar…</p>;

  const ferramentas = [
    { t: "Título de secção", i: Heading2, f: () => formatar("## ", "", "Título da secção", true) },
    { t: "Negrito", i: Bold, f: () => formatar("**", "**") },
    { t: "Itálico", i: Italic, f: () => formatar("*", "*") },
    { t: "Citação", i: Quote, f: () => formatar("> ", "", "Uma frase marcante", true) },
    { t: "Lista", i: List, f: () => formatar("- ", "", "item", true) },
    { t: "Link", i: Link2, f: () => { const u = window.prompt("Cole o endereço (https://…)"); if (u) formatar("[", `](${u})`, "texto do link"); } },
    { t: "Imagem", i: ImageIcon, f: () => { const u = window.prompt("Cole o link directo da imagem (ex.: ImgBB)"); if (u) formatar("![", `](${u})`, "Legenda da imagem", true); } },
  ];

  return (
    <div className="max-w-6xl">
      <Link href="/admin/artigos" className="mb-6 inline-flex items-center gap-2 text-[14px] text-texto/60 hover:text-tinta"><ArrowLeft size={16} /> Artigos</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <textarea rows={2} value={a.titulo} onChange={(e) => mudarTitulo(e.target.value.replace(/\n/g, " "))} placeholder="Título do artigo"
            className="w-full resize-none border-0 border-b border-tinta/15 bg-transparent pb-3 font-serif text-[30px] leading-tight text-tinta outline-none placeholder:text-texto/30 focus:border-tinta sm:text-[38px]" />
          <div>
            <label className="rotulo" htmlFor="resumo">Resumo (aparece nas listas, no Google e quando partilham no WhatsApp)</label>
            <textarea id="resumo" rows={2} maxLength={300} value={a.resumo} onChange={(e) => mudar("resumo", e.target.value)} className="campo resize-none" placeholder="Uma ou duas frases que dão vontade de ler." />
            <p className="mt-1 text-right text-[12px] text-texto/45">{a.resumo.length}/300</p>
          </div>

          <div className={caixaAdm}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-tinta/10 px-2 py-1.5">
              <div className="flex flex-wrap">
                {ferramentas.map((x) => (
                  <button key={x.t} type="button" onClick={x.f} title={x.t} aria-label={x.t} disabled={aba === "ver"} className="grid h-10 w-10 place-items-center text-tinta hover:bg-papel disabled:opacity-30"><x.i size={17} /></button>
                ))}
              </div>
              <div className="flex text-[13px]">
                {(["escrever", "ver"] as const).map((x) => (
                  <button key={x} type="button" onClick={() => setAba(x)} className={`px-3 py-2 ${aba === x ? "font-medium text-tinta" : "text-texto/50"}`}>{x === "escrever" ? "Escrever" : "Pré-visualizar"}</button>
                ))}
              </div>
            </div>
            {aba === "escrever" ? (
              <textarea ref={area} value={a.conteudo} onChange={(e) => mudar("conteudo", e.target.value)} rows={22}
                placeholder={"Escreva aqui o texto.\n\nDeixe uma linha vazia entre parágrafos.\nUse os botões acima para títulos, negrito, citações, listas, links e imagens."}
                className="block w-full resize-y px-5 py-4 font-serif text-[18px] leading-relaxed outline-none" />
            ) : (
              <div className="px-5 py-6">{a.conteudo.trim() ? <Markdown texto={a.conteudo} capitular /> : <p className="text-texto/50">Nada para mostrar ainda.</p>}</div>
            )}
          </div>
          <p className="text-[13px] text-texto/50">{a.conteudo.trim().split(/\s+/).filter(Boolean).length} palavras, cerca de {minutosLeitura(a.conteudo)} min de leitura.</p>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className={`${caixaAdm} space-y-3 p-5`}>
            {a.publicado ? (
              <>
                <button onClick={() => guardar()} disabled={aGuardar} className="btn-tinta w-full">{aGuardar ? "A guardar…" : "Guardar alterações"}</button>
                <button onClick={() => guardar(false)} disabled={aGuardar} className="btn-linha w-full !text-[14px]">Despublicar (voltar a rascunho)</button>
                <a href={`/artigos/${a.slug}`} target="_blank" className="block text-center text-[14px] text-tinta underline">Ver no site</a>
              </>
            ) : (
              <>
                <button onClick={() => guardar(true)} disabled={aGuardar} className="btn-carmim w-full">{aGuardar ? "A guardar…" : "Publicar"}</button>
                <button onClick={() => guardar(false)} disabled={aGuardar} className="btn-linha w-full !text-[14px]">Guardar rascunho</button>
              </>
            )}
            {msg && <p role="status" className={`text-[14px] ${msg.startsWith("Erro") || msg.startsWith("Escreva") || msg.startsWith("Falta") ? "text-carmim" : "text-[#2F5A1E]"}`}>{msg}</p>}
          </div>

          <div className={`${caixaAdm} space-y-5 p-5`}>
            <div>
              <label className="rotulo" htmlFor="cat">Categoria</label>
              <select id="cat" value={a.categoria} onChange={(e) => mudar("categoria", e.target.value)} className="campo">
                {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <Interruptor ligado={a.fixado} onChange={(v) => mudar("fixado", v)} rotulo="Destacar na página inicial" ajuda="Este artigo passa a abrir o site. Só um de cada vez." />
            <div>
              <label className="rotulo" htmlFor="capa">Imagem de capa (link do ImgBB)</label>
              <input id="capa" value={a.capa} onChange={(e) => mudar("capa", e.target.value.trim())} className="campo text-[14px]" placeholder="https://i.ibb.co/…" />
              {a.capa && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.capa} alt="" className="mt-3 aspect-[16/9] w-full object-cover" />
              )}
              <p className="mt-1 text-[12px] text-texto/50">Horizontal, de preferência 1600 × 900.</p>
            </div>
            <div>
              <label className="rotulo" htmlFor="slug">Endereço</label>
              <div className="flex items-center border border-tinta/20 bg-white text-[14px]">
                <span className="pl-3 text-texto/45">/artigos/</span>
                <input id="slug" value={a.slug} onChange={(e) => { setSlugManual(true); mudar("slug", e.target.value); }} onBlur={() => mudar("slug", slugify(a.slug))} className="min-w-0 flex-1 bg-transparent px-1 py-3 outline-none" />
              </div>
            </div>
            {a.publicado && (
              <div>
                <label className="rotulo" htmlFor="data">Data de publicação</label>
                <input id="data" type="date" value={(a.publicado_em || "").slice(0, 10)} onChange={(e) => e.target.value && mudar("publicado_em", new Date(e.target.value + "T09:00:00").toISOString())} className="campo" />
              </div>
            )}
          </div>

          {!novo && <button onClick={apagar} className="flex items-center gap-2 text-[14px] text-carmim hover:underline"><Trash2 size={15} /> Apagar artigo</button>}
        </aside>
      </div>
    </div>
  );
}
