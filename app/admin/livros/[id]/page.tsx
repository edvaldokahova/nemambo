"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { apagarLivro, guardarLivro, umLivro, type LivroEdit } from "@/lib/admin";
import { slugify } from "@/lib/formato";
import { Interruptor, caixaAdm } from "@/components/admin/ui";

const vazio: LivroEdit = { slug: "", titulo: "", subtitulo: "", descricao: "", capa: "", preco_texto: "", link_compra: "", texto_botao: "Comprar o livro", edicao: "", editora: "", paginas: "", isbn: "", destaque: false, ativo: true, ordem: 0 };

export default function EditarLivro({ params }: { params: { id: string } }) {
  const novo = params.id === "novo";
  const router = useRouter();
  const [l, setL] = useState<LivroEdit>(vazio);
  const [carregado, setCarregado] = useState(novo);
  const [msg, setMsg] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    if (novo) return;
    umLivro(params.id).then((r) => {
      if (r) { const { id: _i, cliques: _c, created_at: _d, ...resto } = r; setL(resto); }
      setCarregado(true);
    });
  }, [novo, params.id]);

  const mudar = <K extends keyof LivroEdit>(k: K, v: LivroEdit[K]) => setL((x) => ({ ...x, [k]: v }));

  const guardar = async () => {
    setMsg("");
    if (!l.titulo.trim()) return setMsg("Escreva o título.");
    if (l.link_compra && !/^https?:\/\//i.test(l.link_compra)) return setMsg("O link de compra tem de começar por https://");
    const dados = { ...l, slug: slugify(l.slug || l.titulo) };
    setAGuardar(true);
    const r = await guardarLivro(novo ? null : params.id, dados);
    setAGuardar(false);
    if (r.erro) return setMsg(`Erro: ${r.erro}`);
    setL(dados);
    setMsg("Guardado. No site aparece em até 1 minuto.");
    if (novo && r.id) router.replace(`/admin/livros/${r.id}`);
  };

  const apagar = async () => {
    if (!window.confirm("Apagar este livro de vez? (Para só esconder, desligue «Visível no site».)")) return;
    const e = await apagarLivro(params.id);
    if (e) setMsg(`Erro: ${e}`); else router.replace("/admin/livros");
  };

  if (!carregado) return <p className="text-[14px] text-texto/55">A carregar…</p>;

  const campo = (k: keyof LivroEdit, rotulo: string, ph = "", ajuda = "") => (
    <div>
      <label className="rotulo" htmlFor={k}>{rotulo}</label>
      <input id={k} value={String(l[k] ?? "")} onChange={(e) => mudar(k, e.target.value as never)} placeholder={ph} className="campo" />
      {ajuda && <p className="mt-1 text-[12px] text-texto/50">{ajuda}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl">
      <Link href="/admin/livros" className="mb-6 inline-flex items-center gap-2 text-[14px] text-texto/60 hover:text-tinta"><ArrowLeft size={16} /> Livros</Link>
      <h1 className="mb-8 font-serif text-[34px] font-medium leading-tight text-tinta">{novo ? "Novo livro" : l.titulo}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className={`${caixaAdm} space-y-4 border-l-4 !border-l-carmim p-5`}>
            <h2 className="text-[16px] font-medium text-tinta">Venda</h2>
            {campo("link_compra", "Link de compra (onde o leitor paga)", "https://…", "Cole aqui o link da plataforma onde o livro é vendido. Sem link, o botão abre o seu WhatsApp com a mensagem pronta.")}
            <div className="grid gap-4 sm:grid-cols-2">
              {campo("texto_botao", "Texto do botão", "Comprar o livro")}
              {campo("preco_texto", "Preço (opcional)", "Ex.: 15 000 Kz")}
            </div>
          </section>

          <section className={`${caixaAdm} space-y-4 p-5`}>
            {campo("titulo", "Título")}
            {campo("subtitulo", "Subtítulo")}
            <div>
              <label className="rotulo" htmlFor="descricao">Descrição (deixe uma linha vazia entre parágrafos)</label>
              <textarea id="descricao" rows={10} value={l.descricao} onChange={(e) => mudar("descricao", e.target.value)} className="campo resize-y font-serif text-[17px] leading-relaxed" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {campo("edicao", "Edição", "1.ª edição")}
              {campo("editora", "Editora")}
              {campo("paginas", "Número de páginas")}
              {campo("isbn", "ISBN")}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className={`${caixaAdm} space-y-3 p-5`}>
            <button onClick={guardar} disabled={aGuardar} className="btn-tinta w-full">{aGuardar ? "A guardar…" : "Guardar"}</button>
            {!novo && l.ativo && <a href={`/livros/${l.slug}`} target="_blank" className="block text-center text-[14px] text-tinta underline">Ver no site</a>}
            {msg && <p role="status" className={`text-[14px] ${msg.startsWith("Guardado") ? "text-[#2F5A1E]" : "text-carmim"}`}>{msg}</p>}
          </div>
          <div className={`${caixaAdm} space-y-5 p-5`}>
            <div>
              <label className="rotulo" htmlFor="capa">Capa (link do ImgBB)</label>
              <input id="capa" value={l.capa} onChange={(e) => mudar("capa", e.target.value.trim())} className="campo text-[14px]" placeholder="https://i.ibb.co/…" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {l.capa && <img src={l.capa} alt="" className="mx-auto mt-3 w-40 shadow-md" />}
            </div>
            <Interruptor ligado={l.ativo} onChange={(v) => mudar("ativo", v)} rotulo="Visível no site" />
            <Interruptor ligado={l.destaque} onChange={(v) => mudar("destaque", v)} rotulo="Livro principal" ajuda="Aparece na página inicial e no fim dos artigos." />
            <div>
              <label className="rotulo" htmlFor="slug">Endereço</label>
              <div className="flex items-center border border-tinta/20 bg-white text-[14px]">
                <span className="pl-3 text-texto/45">/livros/</span>
                <input id="slug" value={l.slug} onChange={(e) => mudar("slug", e.target.value)} onBlur={() => mudar("slug", slugify(l.slug || l.titulo))} className="min-w-0 flex-1 bg-transparent px-1 py-3 outline-none" />
              </div>
            </div>
          </div>
          {!novo && <button onClick={apagar} className="flex items-center gap-2 text-[14px] text-carmim hover:underline"><Trash2 size={15} /> Apagar livro</button>}
        </aside>
      </div>
    </div>
  );
}
