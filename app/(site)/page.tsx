import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artigoDestaque, listarArtigos, listarLivros, obterDefinicoes } from "@/lib/dados";
import { SITE_URL, autor, nomeCategoria } from "@/lib/autor";
import { data, minutosLeitura } from "@/lib/formato";
import ArtigoItem from "@/components/ArtigoItem";
import BandaLivro from "@/components/BandaLivro";
import Foto from "@/components/Foto";

export const revalidate = 60;

export default async function Inicio() {
  const [destaque, recentes, livros, d] = await Promise.all([artigoDestaque(), listarArtigos({ limite: 7 }), listarLivros(), obterDefinicoes()]);
  const outros = recentes.filter((a) => a.id !== destaque?.id).slice(0, 6);
  const livro = livros[0];

  const pessoa = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: autor.nomeCompleto,
    alternateName: autor.nome,
    url: SITE_URL,
    image: `${SITE_URL}${autor.foto}`,
    jobTitle: "Chefe de Comunicação",
    description: autor.resumo,
    birthDate: autor.nascimento,
    knowsLanguage: autor.linguas,
    alumniOf: autor.formacao.map((f) => ({ "@type": "CollegeOrUniversity", name: f.escola })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pessoa) }} />

      {/* Abertura: o artigo escolhido no painel; sem artigos, apresenta o autor */}
      {destaque ? (
        <section className="caixa pb-14 pt-8 sm:pb-20 sm:pt-14">
          <Link href={`/artigos/${destaque.slug}`} className="group grid items-center gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
            <div className={`animate-sobe ${destaque.capa ? "lg:order-1" : "lg:col-span-2 lg:max-w-4xl"}`}>
              <p className="rotulo-cat">{nomeCategoria(destaque.categoria)}</p>
              <h1 className="mt-4 font-serif text-[40px] font-medium leading-[1.04] tracking-[-0.015em] text-tinta decoration-carmim/50 decoration-2 underline-offset-[8px] group-hover:underline sm:text-[58px] lg:text-[68px]">
                {destaque.titulo}
              </h1>
              {destaque.resumo && <p className="mt-6 max-w-2xl font-serif text-[20px] leading-relaxed text-texto/75 sm:text-[23px]">{destaque.resumo}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="btn-tinta">Ler o artigo <ArrowRight size={17} /></span>
                <span className="text-[14px] text-texto/55">{data(destaque.publicado_em)}, {minutosLeitura(destaque.conteudo)} min de leitura</span>
              </div>
            </div>
            {destaque.capa && (
              <div className="relative aspect-[4/3] overflow-hidden bg-papel-escuro lg:order-2 lg:aspect-[4/5]">
                <Foto src={destaque.capa} alt="" sizes="(max-width: 1024px) 100vw, 42vw" priority className="transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
            )}
          </Link>
        </section>
      ) : (
        <section className="caixa grid items-end gap-10 pt-10 sm:pt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="animate-sobe pb-6 md:pb-20">
            <p className="rotulo-cat">{autor.funcao}</p>
            <h1 className="mt-4 font-serif text-[48px] font-medium leading-[1.02] tracking-[-0.02em] text-tinta sm:text-[72px]">{autor.frase}</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-texto/70">{autor.resumo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/livros" className="btn-tinta">Conhecer o livro</Link>
              <Link href="/sobre" className="btn-linha">Sobre o autor</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-tinta">
            <Image src={autor.foto} alt={autor.nome} fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-top" />
          </div>
        </section>
      )}

      {/* Mais recentes */}
      {outros.length > 0 && (
        <section className="caixa pb-16 sm:pb-24">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-tinta pb-3">
            <h2 className="font-serif text-[28px] font-medium text-tinta sm:text-[34px]">Mais recentes</h2>
            <Link href="/artigos" className="sublinhado shrink-0 text-[15px] text-tinta">Todos os textos</Link>
          </div>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {outros.map((a) => <ArtigoItem key={a.id} a={a} />)}
          </div>
        </section>
      )}

      {livro && <BandaLivro l={livro} whatsapp={d.whatsapp} />}

      {/* Sobre o autor (quando a abertura é um artigo) */}
      {destaque && (
        <section className="caixa grid items-center gap-10 py-16 sm:py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-tinta">
            <Image src={autor.foto} alt={autor.nome} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover object-top" />
          </div>
          <div>
            <p className="rotulo-cat">Quem escreve</p>
            <h2 className="mt-3 font-serif text-[40px] font-medium leading-tight text-tinta sm:text-[52px]">{autor.nome}</h2>
            <p className="mt-5 max-w-xl font-serif text-[21px] leading-relaxed text-texto/80">{autor.resumo}</p>
            <ul className="mt-8 max-w-xl divide-y divide-tinta/10 border-y border-tinta/10 text-[15px]">
              {autor.formacao.map((f) => (
                <li key={f.grau} className="py-3"><span className="text-tinta">{f.grau}</span><span className="text-texto/55">, {f.escola}</span></li>
              ))}
            </ul>
            <Link href="/sobre" className="btn-linha mt-8">Conhecer o percurso</Link>
          </div>
        </section>
      )}
    </>
  );
}
