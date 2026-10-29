import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listarArtigos, listarLivros, obterArtigo, obterDefinicoes } from "@/lib/dados";
import { SITE_URL, autor, nomeCategoria } from "@/lib/autor";
import { data, minutosLeitura, textoSimples } from "@/lib/formato";
import { Markdown } from "@/lib/markdown";
import ArtigoItem from "@/components/ArtigoItem";
import BandaLivro from "@/components/BandaLivro";
import CaixaAutor from "@/components/CaixaAutor";
import ContarVista from "@/components/ContarVista";
import Foto from "@/components/Foto";
import Partilhar from "@/components/Partilhar";

export const revalidate = 60;

type Props = { params: { slug: string } };

const absoluto = (u: string) => (u.startsWith("/") ? `${SITE_URL}${u}` : u);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await obterArtigo(params.slug);
  if (!a) return { title: "Artigo não encontrado" };
  const desc = (a.resumo || textoSimples(a.conteudo)).slice(0, 160);
  const imagem = a.capa ? absoluto(a.capa) : "/og.jpg";
  return {
    title: a.titulo,
    description: desc,
    alternates: { canonical: `/artigos/${a.slug}` },
    openGraph: { type: "article", title: a.titulo, description: desc, url: `/artigos/${a.slug}`, publishedTime: a.publicado_em ?? undefined, modifiedTime: a.updated_at, authors: [autor.nome], section: nomeCategoria(a.categoria), images: [{ url: imagem }] },
    twitter: { card: "summary_large_image", title: a.titulo, description: desc, images: [imagem] },
  };
}

export default async function ArtigoPagina({ params }: Props) {
  const a = await obterArtigo(params.slug);
  if (!a) notFound();
  const [relacionados, livros, d] = await Promise.all([listarArtigos({ excluir: a.id, limite: 3 }), listarLivros(), obterDefinicoes()]);
  const url = `${SITE_URL}/artigos/${a.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": a.categoria === "opinioes" ? "OpinionNewsArticle" : "Article",
    headline: a.titulo,
    description: a.resumo || textoSimples(a.conteudo).slice(0, 200),
    image: a.capa ? [absoluto(a.capa)] : [`${SITE_URL}/og.jpg`],
    datePublished: a.publicado_em,
    dateModified: a.updated_at,
    inLanguage: "pt",
    mainEntityOfPage: url,
    author: { "@type": "Person", name: autor.nome, url: `${SITE_URL}/sobre` },
    publisher: { "@type": "Person", name: autor.nome, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ContarVista slug={a.slug} />

      <article>
        <header className="estreita pt-10 sm:pt-16">
          <nav className="text-[14px] text-texto/55">
            <Link href={`/artigos?categoria=${a.categoria}`} className="rotulo-cat hover:underline">{nomeCategoria(a.categoria)}</Link>
          </nav>
          <h1 className="mt-4 font-serif text-[38px] font-medium leading-[1.08] tracking-[-0.015em] text-tinta sm:text-[54px]">{a.titulo}</h1>
          {a.resumo && <p className="mt-5 font-serif text-[21px] leading-relaxed text-texto/70 sm:text-[24px]">{a.resumo}</p>}
          <div className="mt-8 flex items-center gap-3 border-t border-tinta/15 pt-5 text-[14px]">
            <span className="text-tinta">Por <Link href="/sobre" className="sublinhado">{autor.nome}</Link></span>
            <span className="text-texto/45">{data(a.publicado_em)}, {minutosLeitura(a.conteudo)} min</span>
          </div>
        </header>

        {a.capa && (
          <div className="caixa mt-10 max-w-[1000px]">
            <div className="relative aspect-[16/9] overflow-hidden bg-papel-escuro">
              <Foto src={a.capa} alt={a.titulo} sizes="(max-width: 1000px) 100vw, 1000px" priority />
            </div>
          </div>
        )}

        <div className="estreita mt-10 sm:mt-14">
          <Markdown texto={a.conteudo} capitular />
          <Partilhar url={url} titulo={a.titulo} className="mt-12" />
          <div className="mt-10"><CaixaAutor /></div>
        </div>
      </article>

      {livros[0] && <div className="mt-16"><BandaLivro l={livros[0]} whatsapp={d.whatsapp} compacta /></div>}

      {relacionados.length > 0 && (
        <section className="caixa py-16 sm:py-20">
          <h2 className="mb-8 border-b-2 border-tinta pb-3 font-serif text-[28px] font-medium text-tinta">Continue a ler</h2>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {relacionados.map((r) => <ArtigoItem key={r.id} a={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
