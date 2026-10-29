"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listarLeitores, todosArtigos, todosLivros, type Leitor } from "@/lib/admin";
import type { Artigo, Livro } from "@/lib/tipos";
import { Titulo, caixaAdm } from "@/components/admin/ui";

export default function Resumo() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    Promise.all([todosArtigos(), todosLivros(), listarLeitores()]).then(([a, l, r]) => { setArtigos(a); setLivros(l); setLeitores(r); setOk(true); });
  }, []);

  const publicados = artigos.filter((a) => a.publicado);
  const vistas = publicados.reduce((s, a) => s + a.vistas, 0);
  const cliques = livros.reduce((s, l) => s + l.cliques, 0);
  const top = [...publicados].sort((a, b) => b.vistas - a.vistas).slice(0, 5);
  const fixado = artigos.find((a) => a.fixado && a.publicado);

  const numeros = [
    ["Artigos publicados", publicados.length, `${artigos.length - publicados.length} rascunho(s)`],
    ["Leituras", vistas, "soma de todos os artigos"],
    ["Cliques em «Comprar»", cliques, "pessoas que foram comprar o livro"],
    ["Leitores inscritos", leitores.length, "emails para novidades"],
  ] as const;

  return (
    <div className="max-w-5xl">
      <Titulo acao={<Link href="/admin/artigos/novo" className="btn-carmim !min-h-[44px] !px-5 text-[14px]"><Plus size={17} /> Escrever artigo</Link>}>Resumo</Titulo>
      {!ok ? <p className="text-[14px] text-texto/55">A carregar…</p> : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {numeros.map(([t, n, s]) => (
              <div key={t} className={`${caixaAdm} p-5`}>
                <p className="text-[13px] text-texto/60">{t}</p>
                <p className="mt-2 font-serif text-[38px] leading-none text-tinta">{n}</p>
                <p className="mt-2 text-[12px] text-texto/45">{s}</p>
              </div>
            ))}
          </div>

          <div className={`${caixaAdm} mt-6 p-5`}>
            <p className="text-[13px] text-texto/60">A abrir a página inicial agora</p>
            {fixado ? (
              <p className="mt-1 text-[16px]"><Link href={`/admin/artigos/${fixado.id}`} className="sublinhado">{fixado.titulo}</Link></p>
            ) : (
              <p className="mt-1 text-[15px] text-texto/70">Nenhum artigo fixado: aparece o mais recente. Para escolher, abra um artigo e ligue «Destacar na página inicial».</p>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className={`${caixaAdm} min-w-0`}>
              <h2 className="border-b border-tinta/10 px-5 py-4 text-[15px] font-medium">Artigos mais lidos</h2>
              {top.length ? (
                <ul className="divide-y divide-tinta/10">
                  {top.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3 text-[14px]">
                      <Link href={`/admin/artigos/${a.id}`} className="min-w-0 truncate hover:underline">{a.titulo}</Link>
                      <span className="shrink-0 tabular-nums text-texto/60">{a.vistas}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="px-5 py-6 text-[14px] text-texto/55">Ainda sem leituras.</p>}
            </section>
            <section className={`${caixaAdm} min-w-0`}>
              <h2 className="border-b border-tinta/10 px-5 py-4 text-[15px] font-medium">Livros</h2>
              <ul className="divide-y divide-tinta/10">
                {livros.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-3 text-[14px]">
                    <Link href={`/admin/livros/${l.id}`} className="min-w-0 truncate hover:underline">{l.titulo}</Link>
                    <span className="shrink-0 text-texto/60">{l.link_compra ? `${l.cliques} cliques` : <span className="text-carmim">falta o link de compra</span>}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
