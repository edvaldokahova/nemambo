import type { Metadata } from "next";
import Link from "next/link";
import { listarLivros, obterDefinicoes } from "@/lib/dados";
import BandaLivro from "@/components/BandaLivro";
import Livro3D from "@/components/Livro3D";
import BotaoComprar from "@/components/BotaoComprar";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Livros",
  description: "Os livros de Pedro Nemambo, incluindo «Contributo da Comunicação no desenvolvimento das instituições públicas em Angola».",
  alternates: { canonical: "/livros" },
};

export default async function Livros() {
  const [livros, d] = await Promise.all([listarLivros(), obterDefinicoes()]);
  const [primeiro, ...resto] = livros;

  return (
    <>
      <div className="caixa pb-10 pt-10 sm:pt-16">
        <h1 className="font-serif text-[48px] font-medium leading-none tracking-[-0.015em] text-tinta sm:text-[68px]">Livros</h1>
        <p className="mt-4 max-w-xl text-[17px] text-texto/65">Obras de Pedro Nemambo sobre comunicação e instituições públicas.</p>
      </div>
      {primeiro ? <BandaLivro l={primeiro} whatsapp={d.whatsapp} /> : <p className="caixa pb-20 font-serif text-[22px] text-texto/60">Brevemente.</p>}
      {resto.length > 0 && (
        <section className="caixa grid gap-14 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
          {resto.map((l) => (
            <article key={l.id} className="text-center">
              <Link href={`/livros/${l.slug}`}><Livro3D capa={l.capa} titulo={l.titulo} className="max-w-[220px]" /></Link>
              <h2 className="mt-6 font-serif text-[26px] font-medium leading-tight text-tinta"><Link href={`/livros/${l.slug}`}>{l.titulo}</Link></h2>
              {l.subtitulo && <p className="mt-2 text-[15px] text-texto/65">{l.subtitulo}</p>}
              {l.preco_texto && <p className="mt-2 text-[15px] text-tinta">{l.preco_texto}</p>}
              <BotaoComprar id={l.id} titulo={l.titulo} link={l.link_compra} texto={l.texto_botao} whatsapp={d.whatsapp} variante="tinta" className="mt-5" />
            </article>
          ))}
        </section>
      )}
    </>
  );
}
