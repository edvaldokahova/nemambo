"use client";
import { useEffect, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { apagarLeitor, listarLeitores, type Leitor } from "@/lib/admin";
import { dataCurta } from "@/lib/formato";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";

export default function Leitores() {
  const [lista, setLista] = useState<Leitor[] | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { listarLeitores().then(setLista); }, []);

  const copiar = async () => {
    try { await navigator.clipboard.writeText((lista ?? []).map((l) => l.email).join(", ")); setMsg("Emails copiados. Cole no campo «Para» (ou «Bcc») do seu email."); } catch { setMsg("Não foi possível copiar."); }
  };
  const apagar = async (l: Leitor) => {
    if (!window.confirm(`Remover ${l.email}?`)) return;
    const e = await apagarLeitor(l.id);
    if (e) setMsg(`Erro: ${e}`); else setLista((x) => (x ?? []).filter((y) => y.id !== l.id));
  };

  return (
    <div className="max-w-3xl">
      <Titulo acao={lista?.length ? <button onClick={copiar} className="btn-tinta !min-h-[44px] !px-5 text-[14px]"><Copy size={16} /> Copiar todos os emails</button> : undefined}>Leitores</Titulo>
      <p className="-mt-4 mb-6 text-[14px] text-texto/60">Pessoas que deixaram o email no site para receber novidades. Quando publicar um artigo ou lançar um livro, envie-lhes um email (use «Bcc» para não mostrar os endereços uns aos outros).</p>
      {msg && <p className="mb-4 text-[14px] text-tinta">{msg}</p>}
      {lista === null ? <p className="text-[14px] text-texto/55">A carregar…</p> : lista.length === 0 ? <Vazio>Ainda ninguém se inscreveu.</Vazio> : (
        <ul className={`${caixaAdm} divide-y divide-tinta/10`}>
          {lista.map((l) => (
            <li key={l.id} className="flex items-center gap-4 px-5 py-3 text-[14px]">
              <span className="min-w-0 flex-1 truncate">{l.email}</span>
              <span className="shrink-0 text-texto/50">{dataCurta(l.created_at)}</span>
              <button onClick={() => apagar(l)} aria-label={`Remover ${l.email}`} className="grid h-9 w-9 place-items-center text-texto/40 hover:text-carmim"><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
