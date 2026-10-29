"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, ExternalLink, FileText, LayoutDashboard, LogOut, Mail, Settings } from "lucide-react";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import { souGerente } from "@/lib/admin";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/admin", nome: "Resumo", icon: LayoutDashboard },
  { href: "/admin/artigos", nome: "Artigos", icon: FileText },
  { href: "/admin/livros", nome: "Livros", icon: BookOpen },
  { href: "/admin/leitores", nome: "Leitores", icon: Mail },
  { href: "/admin/definicoes", nome: "Definições", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/admin";
  const router = useRouter();
  const [estado, setEstado] = useState<"a-verificar" | "ok" | "sem-acesso">("a-verificar");
  const publica = path === "/admin/entrar";

  useEffect(() => {
    if (publica || !supabaseConfigurado) return;
    let ativo = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.replace("/admin/entrar");
      const ok = await souGerente();
      if (ativo) setEstado(ok ? "ok" : "sem-acesso");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") router.replace("/admin/entrar"); });
    return () => { ativo = false; sub.subscription.unsubscribe(); };
  }, [publica, router]);

  if (!supabaseConfigurado) return <div className="grid min-h-screen place-items-center p-8 text-center text-[15px] text-texto/70">O painel precisa das variáveis do Supabase configuradas na Vercel.</div>;
  if (publica) return <>{children}</>;

  const sair = async () => { await supabase.auth.signOut(); router.replace("/admin/entrar"); };

  if (estado === "a-verificar") return <div className="grid min-h-screen place-items-center text-[14px] text-texto/55">A verificar o acesso…</div>;
  if (estado === "sem-acesso") {
    return (
      <div className="grid min-h-screen place-items-center p-8 text-center">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-8 text-[16px]">Esta conta ainda não tem acesso ao painel.</p>
          <p className="mt-2 text-[14px] text-texto/60">Corra o ficheiro supabase/002_ligar_gerente.sql com este email.</p>
          <button onClick={sair} className="btn-linha mt-8">Sair</button>
        </div>
      </div>
    );
  }

  const ativo = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <div className="min-h-screen bg-papel">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-tinta px-4 py-7 text-papel lg:flex">
        <Link href="/admin" className="px-3"><Logo claro className="!text-[20px]" /></Link>
        <p className="mt-1 px-3 text-[12px] text-papel/50">Painel</p>
        <nav className="mt-8 flex-1 space-y-0.5">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors ${ativo(l.href) ? "bg-papel/10 text-papel" : "text-papel/65 hover:text-papel"}`}>
              <l.icon size={17} strokeWidth={1.6} /> {l.nome}
            </Link>
          ))}
        </nav>
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-papel/65 hover:text-papel"><ExternalLink size={16} /> Ver o site</a>
        <button onClick={sair} className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-papel/65 hover:text-papel"><LogOut size={16} /> Sair</button>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-tinta/10 bg-papel px-4 lg:hidden">
        <Logo className="!text-[18px]" />
        <div className="flex">
          <a href="/" target="_blank" aria-label="Ver o site" className="grid h-10 w-10 place-items-center text-tinta"><ExternalLink size={18} /></a>
          <button onClick={sair} aria-label="Sair" className="grid h-10 w-10 place-items-center text-tinta"><LogOut size={18} /></button>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-tinta/10 bg-papel pb-[env(safe-area-inset-bottom)] lg:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] ${ativo(l.href) ? "text-carmim" : "text-texto/55"}`}>
            <l.icon size={19} strokeWidth={1.6} /> {l.nome}
          </Link>
        ))}
      </nav>

      <main className="px-4 pb-28 pt-6 sm:px-8 lg:ml-60 lg:px-12 lg:pb-16 lg:pt-10">{children}</main>
    </div>
  );
}
