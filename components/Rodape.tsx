import Link from "next/link";
import type { Definicoes } from "@/lib/tipos";
import { autor } from "@/lib/autor";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import Redes from "./Redes";

export default function Rodape({ d }: { d: Definicoes }) {
  return (
    <footer className="bg-tinta text-papel">
      <div className="caixa grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-serif text-[30px] leading-tight sm:text-[38px]">Receba os novos textos no seu email.</p>
          <p className="mt-3 max-w-md text-[15px] text-papel/65">Artigos, ideias e novidades sobre os livros. Sem excessos, só quando houver algo que valha a pena ler.</p>
          <div className="mt-7 max-w-lg"><Newsletter origem="rodape" escuro /></div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-[15px] lg:justify-self-end">
          <nav className="space-y-3 text-papel/75">
            <Link href="/artigos" className="block hover:text-papel">Artigos</Link>
            <Link href="/artigos?categoria=ideias" className="block hover:text-papel">Ideias</Link>
            <Link href="/artigos?categoria=opinioes" className="block hover:text-papel">Opinião</Link>
            <Link href="/livros" className="block hover:text-papel">Livros</Link>
            <Link href="/sobre" className="block hover:text-papel">Sobre o autor</Link>
          </nav>
          <div className="space-y-4">
            <Redes d={d} claro />
          </div>
        </div>
      </div>
      <div className="border-t border-papel/10">
        <div className="caixa flex flex-col gap-2 py-6 text-[13px] text-papel/50 sm:flex-row sm:items-center sm:justify-between">
          <Logo claro className="!text-[18px]" />
          <p>© {new Date().getFullYear()} {autor.nomeCompleto}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
