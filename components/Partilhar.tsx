"use client";
import { useEffect, useState } from "react";
import { Check, Facebook, Link2, Linkedin, Share2 } from "lucide-react";
import WaIcone from "./WaIcone";

function XIcone({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /></svg>;
}

export default function Partilhar({ url, titulo, className = "" }: { url: string; titulo: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);
  const [temNativo, setTemNativo] = useState(false);
  useEffect(() => setTemNativo(typeof navigator !== "undefined" && "share" in navigator), []);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(titulo);
  const redes = [
    { nome: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${titulo}\n${url}`)}`, icon: <WaIcone size={17} /> },
    { nome: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <Facebook size={16} strokeWidth={1.7} /> },
    { nome: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <Linkedin size={16} strokeWidth={1.7} /> },
    { nome: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: <XIcone size={14} /> },
  ];
  const copiar = async () => {
    try { await navigator.clipboard.writeText(url); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch {}
  };
  const nativo = async () => {
    try { await navigator.share({ title: titulo, url }); } catch {}
  };
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-tinta/15 text-tinta transition-colors hover:border-tinta hover:bg-tinta hover:text-papel";
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="mr-2 text-[14px] text-texto/60">Partilhar</span>
      {redes.map((r) => (
        <a key={r.nome} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={`Partilhar no ${r.nome}`} className={btn}>{r.icon}</a>
      ))}
      <button type="button" onClick={copiar} aria-label="Copiar o link" className={btn}>{copiado ? <Check size={16} /> : <Link2 size={16} strokeWidth={1.7} />}</button>
      {temNativo && (
        <button type="button" onClick={nativo} aria-label="Mais opções de partilha" className={`${btn} sm:hidden`}><Share2 size={16} strokeWidth={1.7} /></button>
      )}
      {copiado && <span className="text-[13px] text-carmim">Link copiado</span>}
    </div>
  );
}
