"use client";
import { useState } from "react";
import { subscrever } from "@/lib/dados";

export default function Newsletter({ origem, escuro = false }: { origem: string; escuro?: boolean }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"" | "a-enviar" | "ok">("");
  const [erro, setErro] = useState("");
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setEstado("a-enviar");
    const r = await subscrever(email.trim(), "", origem);
    if (r) { setErro(r); setEstado(""); } else setEstado("ok");
  };
  if (estado === "ok") return <p className={`text-[16px] ${escuro ? "text-papel" : "text-tinta"}`}>Obrigado. Vai receber as próximas novidades no seu email.</p>;
  return (
    <form onSubmit={enviar} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-${origem}`} className="sr-only">O seu email</label>
        <input id={`nl-${origem}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu email" autoComplete="email"
          className={`min-h-[50px] flex-1 border px-4 text-[16px] outline-none transition-colors ${escuro ? "border-papel/25 bg-transparent text-papel placeholder:text-papel/45 focus:border-papel" : "border-tinta/20 bg-white text-texto placeholder:text-texto/40 focus:border-tinta"}`} />
        <button disabled={estado === "a-enviar"} className={escuro ? "btn-carmim" : "btn-tinta"}>{estado === "a-enviar" ? "A guardar…" : "Quero receber"}</button>
      </div>
      {erro && <p role="alert" className="mt-2 text-[14px] text-carmim-claro">{erro}</p>}
    </form>
  );
}
