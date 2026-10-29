"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pin, Plus } from "lucide-react";
import { todosArtigos } from "@/lib/admin";
import type { Artigo } from "@/lib/tipos";
import { nomeCategoria } from "@/lib/autor";
import { dataCurta } from "@/lib/formato";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";

export default function ListaArtigos() {
  const [artigos, setArtigos] = useState<Artigo[] | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "publicados" | "rascunhos">("todos");
  useEffect(() => { todosArtigos().then(setArtigos); }, []);

  const lista = (artigos ?? []).filter((a) => (filtro === "todos" ? true : filtro === "publicados" ? a.publicado : !a.publicado));
  return (
    <div className="max-w-5xl">
      <Titulo acao={<Link href="/admin/artigos/novo" className="btn-carmim !min-h-[44px] !px-5 text-[14px]"><Plus size={17} /> Escrever artigo</Link>}>Artigos</Titulo>
      <div className="mb-5 flex gap-2 text-[14px]">
        {(["todos", "publicados", "rascunhos"] as const).map((f) => (
          <button key={f} onClick={() => setFiltro(f)} className={`rounded-full border px-4 py-1.5 capitalize ${filtro === f ? "border-tinta bg-tinta text-papel" : "border-tinta/20"}`}>{f}</button>
        ))}
      </div>
      {artigos === null ? <p className="text-[14px] text-texto/55">A carregar…</p> : lista.length === 0 ? (
        <Vazio>Ainda não há artigos aqui. <Link href="/admin/artigos/novo" className="sublinhado text-tinta">Escrever o primeiro</Link></Vazio>
      ) : (
        <ul className={`${caixaAdm} divide-y divide-tinta/10`}>
          {lista.map((a) => (
            <li key={a.id}>
              <Link href={`/admin/artigos/${a.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-papel">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-[15px] text-tinta">{a.fixado && <Pin size={14} className="shrink-0 text-carmim" aria-label="Em destaque" />}{a.titulo}</p>
                  <p className="mt-0.5 text-[13px] text-texto/55">{nomeCategoria(a.categoria)}, {a.publicado ? `publicado a ${dataCurta(a.publicado_em)}` : "rascunho"}</p>
                </div>
                <span className="hidden shrink-0 text-[13px] tabular-nums text-texto/55 sm:block">{a.vistas} leituras</span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] ${a.publicado ? "bg-[#DDEBD6] text-[#2F5A1E]" : "bg-papel-escuro text-texto/65"}`}>{a.publicado ? "Publicado" : "Rascunho"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
