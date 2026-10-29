import Link from "next/link";
import type { Artigo } from "@/lib/tipos";
import { nomeCategoria } from "@/lib/autor";
import { data, minutosLeitura } from "@/lib/formato";
import Foto from "./Foto";

// Artigo numa lista: filete por cima, à maneira de uma coluna de jornal.
export default function ArtigoItem({ a, imagem = true, grande = false }: { a: Artigo; imagem?: boolean; grande?: boolean }) {
  return (
    <article className="group border-t border-tinta/15 pt-5">
      <Link href={`/artigos/${a.slug}`} className="block">
        {imagem && a.capa && (
          <div className="relative mb-5 aspect-[3/2] overflow-hidden bg-papel-escuro">
            <Foto src={a.capa} alt="" sizes="(max-width: 768px) 100vw, 33vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
        )}
        <p className="rotulo-cat">{nomeCategoria(a.categoria)}</p>
        <h3 className={`mt-2 font-serif font-medium leading-[1.15] text-tinta decoration-carmim/60 underline-offset-[5px] group-hover:underline ${grande ? "text-[30px] sm:text-[34px]" : "text-[24px] sm:text-[26px]"}`}>{a.titulo}</h3>
        {a.resumo && <p className="mt-3 line-clamp-3 text-[16px] leading-relaxed text-texto/70">{a.resumo}</p>}
        <p className="mt-4 text-[13px] text-texto/50">{data(a.publicado_em)}, {minutosLeitura(a.conteudo || "")} min de leitura</p>
      </Link>
    </article>
  );
}
