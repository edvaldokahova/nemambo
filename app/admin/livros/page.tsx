"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { todosLivros } from "@/lib/admin";
import type { Livro } from "@/lib/tipos";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";

export default function ListaLivros() {
  const [livros, setLivros] = useState<Livro[] | null>(null);
  useEffect(() => { todosLivros().then(setLivros); }, []);
  return (
    <div className="max-w-4xl">
      <Titulo acao={<Link href="/admin/livros/novo" className="btn-carmim !min-h-[44px] !px-5 text-[14px]"><Plus size={17} /> Novo livro</Link>}>Livros</Titulo>
      {livros === null ? <p className="text-[14px] text-texto/55">A carregar…</p> : livros.length === 0 ? <Vazio>Ainda não há livros.</Vazio> : (
        <ul className={`${caixaAdm} divide-y divide-tinta/10`}>
          {livros.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/livros/${l.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-papel">
                <div className="relative h-16 w-11 shrink-0 overflow-hidden bg-papel-escuro">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.capa && <img src={l.capa} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] text-tinta">{l.titulo}</p>
                  <p className="mt-0.5 text-[13px] text-texto/55">{l.link_compra ? `${l.cliques} cliques em «Comprar»` : <span className="text-carmim">Falta o link de compra (até lá, o botão abre o WhatsApp)</span>}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] ${l.ativo ? "bg-[#DDEBD6] text-[#2F5A1E]" : "bg-papel-escuro text-texto/65"}`}>{l.ativo ? "Visível" : "Escondido"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
