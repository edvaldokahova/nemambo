"use client";
import { ArrowUpRight } from "lucide-react";
import { contarClique } from "@/lib/dados";
import { waLink } from "@/lib/formato";
import WaIcone from "./WaIcone";

// Botão de compra: abre a plataforma de venda (link do painel) e conta o clique.
// Sem link, encaminha para o WhatsApp do autor com a mensagem pronta.
export default function BotaoComprar({ id, titulo, link, texto, whatsapp, variante = "carmim", className = "" }: {
  id: string; titulo: string; link: string; texto: string; whatsapp: string; variante?: "carmim" | "claro" | "tinta"; className?: string;
}) {
  const href = link || (whatsapp ? waLink(whatsapp, `Olá, Pedro! Quero comprar o livro «${titulo}». Como posso adquirir?`) : "");
  if (!href) return <span className={`btn-linha pointer-events-none opacity-60 ${className}`}>Brevemente à venda</span>;
  const cls = variante === "claro" ? "btn-claro" : variante === "tinta" ? "btn-tinta" : "btn-carmim";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => { contarClique(id).catch(() => {}); }} className={`${cls} ${className}`}>
      {link ? <>{texto || "Comprar o livro"} <ArrowUpRight size={18} strokeWidth={1.8} /></> : <><WaIcone size={18} /> Encomendar pelo WhatsApp</>}
    </a>
  );
}
