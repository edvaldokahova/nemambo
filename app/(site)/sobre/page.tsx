import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { listarLivros, obterDefinicoes } from "@/lib/dados";
import { SITE_URL, autor } from "@/lib/autor";
import { waLink } from "@/lib/formato";
import Livro3D from "@/components/Livro3D";
import Redes from "@/components/Redes";
import WaIcone from "@/components/WaIcone";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sobre Pedro Nemambo",
  description: `${autor.nomeCompleto}: jornalista, mestre em Ciência Política e Administração Pública, Chefe de Comunicação do CPL SPCB, coach, editor de conteúdos e autor.`,
  alternates: { canonical: "/sobre" },
  openGraph: { type: "profile", title: "Sobre Pedro Nemambo", images: [{ url: "/img/pedro-nemambo.webp" }] },
};

export default async function Sobre() {
  const [d, livros] = await Promise.all([obterDefinicoes(), listarLivros()]);
  const livro = livros[0];
  const ld = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: autor.nomeCompleto,
      alternateName: autor.nome,
      image: `${SITE_URL}${autor.foto}`,
      birthDate: autor.nascimento,
      birthPlace: autor.naturalidade,
      jobTitle: "Chefe de Comunicação",
      worksFor: { "@type": "Organization", name: "CPL SPCB" },
      knowsLanguage: autor.linguas,
      alumniOf: autor.formacao.map((f) => ({ "@type": "CollegeOrUniversity", name: f.escola })),
      url: `${SITE_URL}/sobre`,
    },
  };
  const contactar = d.whatsapp ? waLink(d.whatsapp, "Olá, Pedro! Vim pelo seu site e gostaria de falar consigo.") : d.email ? `mailto:${d.email}` : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="caixa grid items-end gap-10 pt-10 sm:pt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
        <div className="animate-sobe pb-4 md:pb-16">
          <p className="rotulo-cat">Sobre o autor</p>
          <h1 className="mt-4 font-serif text-[48px] font-medium leading-[1.02] tracking-[-0.02em] text-tinta sm:text-[76px]">{autor.nome}</h1>
          <p className="mt-6 max-w-xl font-serif text-[21px] leading-relaxed text-texto/80 sm:text-[24px]">
            Jornalista de formação, servidor público por vocação. Escreve sobre comunicação, instituições e a Angola que se constrói todos os dias.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-tinta">
          <Image src={autor.foto} alt={`Retrato de ${autor.nome}`} fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-top" />
        </div>
      </section>

      <section className="estreita py-16 sm:py-24">
        <div className="prosa capitular">
          <p>
            {autor.nomeCompleto} nasceu a 25 de Maio de 1989, no Nzeto, província do Zaire. É filho de Bartolomeu Domingos Nemambo e de Joaquina Domingos João.
          </p>
          <p>
            Licenciou-se em Comunicação Social pelo Instituto Superior de Angola (ISA), fez a pós-graduação em Agregação Pedagógica na Universidade Óscar Ribas e
            concluiu o Mestrado em Ciência Política e Administração Pública na Universidade Agostinho Neto (UAN).
          </p>
          <p>
            É funcionário público e Chefe de Comunicação do CPL SPCB. Trabalha também como coach, gestor e editor de conteúdos jornalísticos, e orienta trabalhos
            académicos, monografias e dissertações. É um dos sócios da NK Luzindalalu.
          </p>
          <p>
            É autor do livro <em>Contributo da Comunicação no desenvolvimento das instituições públicas em Angola: seu valor na dinâmica de uma comunicação fluida</em>.
            Fala e escreve português e kikongo.
          </p>
        </div>
      </section>

      <section className="border-y border-tinta/10 bg-papel-claro">
        <div className="caixa grid gap-12 py-16 sm:py-20 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-serif text-[30px] font-medium text-tinta sm:text-[36px]">Formação</h2>
            <ol className="mt-8 space-y-0 border-l border-tinta/20">
              {autor.formacao.map((f) => (
                <li key={f.grau} className="relative pb-8 pl-7 last:pb-0">
                  <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-carmim" aria-hidden />
                  <p className="font-serif text-[21px] leading-snug text-tinta">{f.grau}</p>
                  <p className="mt-1 text-[15px] text-texto/60">{f.escola}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-serif text-[30px] font-medium text-tinta sm:text-[36px]">Percurso</h2>
            <ul className="mt-8 divide-y divide-tinta/10 border-y border-tinta/10">
              {autor.percurso.map((p) => (
                <li key={p.titulo} className="py-4">
                  <p className="text-[17px] text-tinta">{p.titulo}</p>
                  <p className="mt-1 text-[15px] text-texto/60">{p.texto}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-texto/65">Línguas: {autor.linguas.join(" e ")}.</p>
          </div>
        </div>
      </section>

      <section className="caixa py-16 sm:py-24">
        <h2 className="max-w-2xl font-serif text-[34px] font-medium leading-tight text-tinta sm:text-[44px]">Como posso ajudar</h2>
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {autor.servicos.map((s, i) => (
            <div key={s.titulo} className="border-t-2 border-tinta pt-5">
              <p className="font-serif text-[15px] text-carmim">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-[24px] font-medium leading-snug text-tinta">{s.titulo}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-texto/70">{s.texto}</p>
            </div>
          ))}
        </div>
        {contactar && (
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a href={contactar} target="_blank" rel="noopener noreferrer" className="btn-tinta">
              {d.whatsapp ? <WaIcone size={18} /> : <Mail size={17} />} Falar com Pedro Nemambo
            </a>
            {d.whatsapp && d.email && <a href={`mailto:${d.email}`} className="btn-linha"><Mail size={17} /> {d.email}</a>}
          </div>
        )}
        <div className="mt-8"><Redes d={d} /></div>
      </section>

      {livro && (
        <section className="bg-tinta text-papel">
          <div className="caixa grid items-center gap-10 py-16 sm:grid-cols-[220px_1fr] sm:gap-14">
            <Livro3D capa={livro.capa} titulo={livro.titulo} className="max-w-[200px]" />
            <div>
              <p className="text-[14px] text-papel/60">O livro</p>
              <p className="mt-2 font-serif text-[32px] leading-tight sm:text-[40px]">{livro.titulo}</p>
              <Link href={`/livros/${livro.slug}`} className="btn-carmim mt-7">Conhecer o livro</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
