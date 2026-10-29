"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

export default function Entrar() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [aEnviar, setAEnviar] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setAEnviar(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setAEnviar(false);
    if (error) return setMsg("Email ou senha incorrectos.");
    router.replace("/admin");
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center"><Logo /></div>
        <h1 className="mt-10 text-center font-serif text-[32px] text-tinta">Entrar no painel</h1>
        <form onSubmit={enviar} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="rotulo">Email</label>
            <input id="email" type="email" className="campo" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="senha" className="rotulo">Senha</label>
            <input id="senha" type="password" className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required />
          </div>
          {msg && <p role="alert" className="text-[14px] text-carmim">{msg}</p>}
          <button disabled={aEnviar} className="btn-tinta w-full">{aEnviar ? "Um momento…" : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}
