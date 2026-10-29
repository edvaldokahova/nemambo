import type { Metadata } from "next";
import Link from "next/link";
import { listarArtigos } from "@/lib/dados";
import { CATEGORIAS } from "@/lib/autor";
import ArtigoItem from "@/components/ArtigoItem";

export const revalidate = 60;

type Props = { searchParams: { categoria?: string } };

export function generateMetadata({ searchParams }: Props): Metadata {
  const c = CATEGORIAS.find((x) => x.id === searchParams.categoria);
  return {
    title: c ? c.plural : "Artigos, ideias e opinião",
    description: c ? c.desc : "Todos os textos de Pedro Nemambo: análises, ideias e opinião sobre comunicação, administração pública e Angola.",
    alternates: { canonical: c ? `/artigos?categoria=${c.id}` : "/artigos" },
  };
}

export default async function Artigos({ searchParams }: Props) {
  const c = CATEGORIAS.find((x) => x.id === searchParams.categoria);
  const artigos = await listarArtigos({ categoria: c?.id, limite: 100 });
  const abas = [{ id: "", nome: "Todos" }, ...CATEGORIAS.map((x) => ({ id: x.id, nome: x.plural }))];

  return (
    <div className="caixa pb-20 pt-10 sm:pt-16">
      <h1 className="font-serif text-[48px] font-medium leading-none tracking-[-0.015em] text-tinta sm:text-[68px]">{c ? c.plural : "Textos"}</h1>
      <p className="mt-4 max-w-xl text-[17px] text-texto/65">{c ? c.desc : "Artigos, ideias e opinião sobre comunicação, administração pública e Angola."}</p>

      <nav aria-label="Categorias" className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-2 border-b border-tinta/15">
          {abas.map((a) => {
            const ativo = (c?.id ?? "") === a.id;
            return (
              <li key={a.id}>
                <Link href={a.id ? `/artigos?categoria=${a.id}` : "/artigos"} aria-current={ativo ? "page" : undefined}
                  className={`-mb-px block border-b-2 px-3 py-3 text-[15px] transition-colors ${ativo ? "border-carmim text-tinta" : "border-transparent text-texto/55 hover:text-tinta"}`}>
                  {a.nome}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {artigos.length ? (
        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {artigos.map((a, i) => <ArtigoItem key={a.id} a={a} grande={i === 0} />)}
        </div>
      ) : (
        <p className="mt-16 max-w-md font-serif text-[22px] text-texto/60">Os primeiros textos {c ? `de ${c.plural.toLowerCase()} ` : ""}estão a caminho. Volte em breve.</p>
      )}
    </div>
  );
}
