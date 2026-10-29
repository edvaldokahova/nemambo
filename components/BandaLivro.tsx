import Link from "next/link";
import type { Livro } from "@/lib/tipos";
import Livro3D from "./Livro3D";
import BotaoComprar from "./BotaoComprar";

// Faixa escura de venda do livro, usada na página inicial e no fim dos artigos.
export default function BandaLivro({ l, whatsapp, compacta = false }: { l: Livro; whatsapp: string; compacta?: boolean }) {
  const primeiroParagrafo = l.descricao.split(/\n{2,}/)[0];
  return (
    <section className="relative overflow-hidden bg-tinta text-papel" aria-labelledby={`livro-${l.id}`}>
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.07),transparent_65%)]" />
      <div className={`caixa relative grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 ${compacta ? "py-14 sm:py-16" : "py-16 sm:py-24"}`}>
        <Livro3D capa={l.capa} titulo={l.titulo} className={compacta ? "max-w-[220px]" : "max-w-[300px]"} />
        <div>
          <p className="text-[14px] text-papel/60">{compacta ? "Do mesmo autor" : `O livro de Pedro Nemambo${l.edicao ? `, ${l.edicao}` : ""}`}</p>
          <h2 id={`livro-${l.id}`} className={`mt-3 font-serif font-medium leading-[1.05] ${compacta ? "text-[34px] sm:text-[40px]" : "text-[40px] sm:text-[56px]"}`}>{l.titulo}</h2>
          {l.subtitulo && <p className="mt-3 font-serif text-[20px] italic leading-snug text-papel/75 sm:text-[23px]">{l.subtitulo}</p>}
          {!compacta && <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-papel/70">{primeiroParagrafo}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BotaoComprar id={l.id} titulo={l.titulo} link={l.link_compra} texto={l.texto_botao} whatsapp={whatsapp} />
            <Link href={`/livros/${l.slug}`} className="btn-claro">Saber mais</Link>
            {l.preco_texto && <span className="text-[15px] text-papel/70 sm:ml-3">{l.preco_texto}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
