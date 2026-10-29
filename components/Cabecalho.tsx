"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/artigos", nome: "Artigos" },
  { href: "/artigos?categoria=ideias", nome: "Ideias" },
  { href: "/artigos?categoria=opinioes", nome: "Opinião" },
  { href: "/livros", nome: "Livros" },
  { href: "/sobre", nome: "Sobre" },
];

export default function Cabecalho() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffect(() => setMenu(false), [path]);

  return (
    <>
      <header className={`sticky top-0 z-40 border-b bg-papel/95 backdrop-blur transition-colors duration-300 ${rolou ? "border-tinta/10" : "border-transparent"}`}>
        <div className="caixa flex h-16 items-center justify-between sm:h-[76px]">
          <Link href="/" aria-label="Pedro Nemambo, página inicial"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-[15px] text-texto/75 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-tinta">{l.nome}</Link>
            ))}
          </nav>
          <Link href="/livros" className="btn-tinta hidden !min-h-[42px] !px-5 !text-[14px] lg:inline-flex">O livro</Link>
          <button type="button" onClick={() => setMenu(true)} aria-label="Abrir menu" className="-mr-2 grid h-11 w-11 place-items-center text-tinta md:hidden">
            <Menu size={23} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 flex animate-fade flex-col bg-tinta text-papel md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="caixa flex h-16 items-center justify-between">
            <Logo claro />
            <button type="button" onClick={() => setMenu(false)} aria-label="Fechar menu" className="-mr-2 grid h-11 w-11 place-items-center"><X size={24} strokeWidth={1.5} /></button>
          </div>
          <nav className="caixa flex-1 pt-8">
            <Link href="/" className="block border-b border-papel/10 py-4 font-serif text-[34px]">Início</Link>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="block border-b border-papel/10 py-4 font-serif text-[34px]">{l.nome}</Link>
            ))}
          </nav>
          <div className="caixa pb-10">
            <Link href="/livros" className="btn-carmim w-full">Conhecer o livro</Link>
          </div>
        </div>
      )}
    </>
  );
}
