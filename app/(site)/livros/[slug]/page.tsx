import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarArtigos, obterDefinicoes, obterLivro } from "@/lib/dados";
import { SITE_URL, autor } from "@/lib/autor";
import ArtigoItem from "@/components/ArtigoItem";
import BotaoComprar from "@/components/BotaoComprar";
import CaixaAutor from "@/components/CaixaAutor";
import Livro3D from "@/components/Livro3D";
import Partilhar from "@/components/Partilhar";

export const revalidate = 60;

type Props = { params: { slug: string } };
const absoluto = (u: string) => (u.startsWith("/") ? `${SITE_URL}${u}` : u);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await obterLivro(params.slug);
  if (!l) return { title: "Livro não encontrado" };
  const desc = `${l.subtitulo ? l.subtitulo + ". " : ""}${l.descricao}`.replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${l.titulo}, livro de ${autor.nome}`,
    description: desc,
    alternates: { canonical: `/livros/${l.slug}` },
    openGraph: { type: "book", title: l.titulo, description: desc, url: `/livros/${l.slug}`, images: l.capa ? [{ url: absoluto(l.capa) }] : ["/og.jpg"] },
    twitter: { card: "summary_large_image", title: l.titulo, description: desc, images: [l.capa ? absoluto(l.capa) : "/og.jpg"] },
  };
}

export default async function LivroPagina({ params }: Props) {
  const l = await obterLivro(params.slug);
  if (!l) notFound();
  const [d, artigos] = await Promise.all([obterDefinicoes(), listarArtigos({ limite: 3 })]);
  const url = `${SITE_URL}/livros/${l.slug}`;
  const ficha = [
    ["Autor", autor.nome],
    ["Edição", l.edicao],
    ["Editora", l.editora],
    ["Páginas", l.paginas],
    ["ISBN", l.isbn],
    ["Língua", "Português"],
  ].filter(([, v]) => v);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: l.titulo,
    alternativeHeadline: l.subtitulo || undefined,
    description: l.descricao,
    image: l.capa ? absoluto(l.capa) : undefined,
    url,
    inLanguage: "pt",
    bookEdition: l.edicao || undefined,
    isbn: l.isbn || undefined,
    numberOfPages: Number(l.paginas) || undefined,
    publisher: l.editora ? { "@type": "Organization", name: l.editora } : undefined,
    author: { "@type": "Person", name: autor.nomeCompleto, url: `${SITE_URL}/sobre` },
    ...(l.link_compra ? { offers: { "@type": "Offer", url: l.link_compra, availability: "https://schema.org/InStock" } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="caixa grid gap-12 pb-16 pt-10 sm:pt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <Livro3D capa={l.capa} titulo={l.titulo} priority className="max-w-[320px]" />
        </div>
        <div>
          <p className="rotulo-cat">Livro{l.edicao ? `, ${l.edicao}` : ""}</p>
          <h1 className="mt-3 font-serif text-[42px] font-medium leading-[1.04] tracking-[-0.015em] text-tinta sm:text-[60px]">{l.titulo}</h1>
          {l.subtitulo && <p className="mt-4 font-serif text-[22px] italic leading-snug text-texto/70 sm:text-[25px]">{l.subtitulo}</p>}

          <div className="mt-8 flex flex-col gap-4 border-y border-tinta/15 py-6 sm:flex-row sm:items-center">
            <BotaoComprar id={l.id} titulo={l.titulo} link={l.link_compra} texto={l.texto_botao} whatsapp={d.whatsapp} className="sm:min-w-[240px]" />
            {l.preco_texto && <p className="font-serif text-[26px] text-tinta sm:ml-2">{l.preco_texto}</p>}
          </div>

          <div className="mt-10 space-y-5 font-serif text-[19px] leading-[1.7] text-texto sm:text-[20px]">
            {l.descricao.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {ficha.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-x-8 border-t border-tinta/15 text-[15px] sm:grid-cols-3">
              {ficha.map(([k, v]) => (
                <div key={k} className="border-b border-tinta/10 py-4">
                  <dt className="text-[13px] text-texto/50">{k}</dt>
                  <dd className="mt-1 text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <Partilhar url={url} titulo={`${l.titulo}, de ${autor.nome}`} className="mt-10" />
          <div className="mt-10"><CaixaAutor /></div>
        </div>
      </section>

      {artigos.length > 0 && (
        <section className="caixa pb-20">
          <h2 className="mb-8 border-b-2 border-tinta pb-3 font-serif text-[28px] font-medium text-tinta">Textos do autor</h2>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">{artigos.map((a) => <ArtigoItem key={a.id} a={a} />)}</div>
        </section>
      )}
    </>
  );
}
