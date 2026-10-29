import Link from "next/link";
import Logo from "@/components/Logo";

export default function NaoEncontrado() {
  return (
    <div className="grid min-h-screen place-items-center bg-papel px-6 text-center">
      <div>
        <Link href="/"><Logo /></Link>
        <h1 className="mt-12 font-serif text-[44px] leading-tight text-tinta">Esta página não existe.</h1>
        <p className="mt-3 text-[16px] text-texto/65">Pode ter mudado de endereço ou sido removida.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/artigos" className="btn-tinta">Ler os artigos</Link>
          <Link href="/" className="btn-linha">Página inicial</Link>
        </div>
      </div>
    </div>
  );
}
