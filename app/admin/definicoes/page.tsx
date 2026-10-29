"use client";
import { useEffect, useState } from "react";
import { definicoesPadrao, obterDefinicoes } from "@/lib/dados";
import { guardarDefinicoes } from "@/lib/admin";
import type { Definicoes } from "@/lib/tipos";
import { Titulo, caixaAdm } from "@/components/admin/ui";

const CAMPOS: { k: keyof Definicoes; rotulo: string; ph: string; ajuda?: string }[] = [
  { k: "whatsapp", rotulo: "WhatsApp", ph: "9XX XXX XXX", ajuda: "Usado no botão «Falar com Pedro» e na compra do livro quando não há link." },
  { k: "email", rotulo: "Email de contacto", ph: "nome@exemplo.com" },
  { k: "linkedin", rotulo: "LinkedIn", ph: "https://www.linkedin.com/in/…" },
  { k: "facebook", rotulo: "Facebook", ph: "https://www.facebook.com/…" },
  { k: "instagram", rotulo: "Instagram", ph: "https://www.instagram.com/…" },
  { k: "youtube", rotulo: "YouTube", ph: "https://www.youtube.com/@…" },
  { k: "tiktok", rotulo: "TikTok", ph: "https://www.tiktok.com/@…" },
];

export default function Definicoes() {
  const [d, setD] = useState<Definicoes>(definicoesPadrao);
  const [msg, setMsg] = useState("");
  const [aGuardar, setAGuardar] = useState(false);
  useEffect(() => { obterDefinicoes().then(setD); }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAGuardar(true);
    const erro = await guardarDefinicoes(d);
    setAGuardar(false);
    setMsg(erro ? `Erro: ${erro}` : "Guardado. No site aparece em até 1 minuto.");
  };

  return (
    <div className="max-w-2xl">
      <Titulo>Definições</Titulo>
      <form onSubmit={guardar} className={`${caixaAdm} space-y-5 p-5 sm:p-7`}>
        <p className="text-[14px] text-texto/60">Contactos e redes sociais. Campos vazios não aparecem no site.</p>
        {CAMPOS.map((c) => (
          <div key={c.k}>
            <label className="rotulo" htmlFor={c.k}>{c.rotulo}</label>
            <input id={c.k} value={d[c.k]} onChange={(e) => setD({ ...d, [c.k]: e.target.value })} onBlur={() => setD({ ...d, [c.k]: d[c.k].trim() })} placeholder={c.ph} className="campo" />
            {c.ajuda && <p className="mt-1 text-[12px] text-texto/50">{c.ajuda}</p>}
          </div>
        ))}
        <button disabled={aGuardar} className="btn-tinta">{aGuardar ? "A guardar…" : "Guardar"}</button>
        {msg && <p role="status" className="text-[14px] text-tinta">{msg}</p>}
      </form>
    </div>
  );
}
