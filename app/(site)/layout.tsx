import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import { obterDefinicoes } from "@/lib/dados";

export const revalidate = 60;

export default async function LayoutSite({ children }: { children: React.ReactNode }) {
  const d = await obterDefinicoes();
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-tinta focus:px-4 focus:py-2 focus:text-papel">Saltar para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape d={d} />
    </>
  );
}
