import Image from "next/image";
import Link from "next/link";
import { autor } from "@/lib/autor";

export default function CaixaAutor() {
  return (
    <aside className="flex gap-5 border-y border-tinta/15 py-7">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-tinta">
        <Image src={autor.foto} alt={autor.nome} fill sizes="80px" className="object-cover object-top" />
      </div>
      <div>
        <p className="font-serif text-[22px] text-tinta">{autor.nome}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-texto/70">{autor.resumo}</p>
        <Link href="/sobre" className="sublinhado mt-2 inline-block text-[14px] text-tinta">Conhecer o autor</Link>
      </div>
    </aside>
  );
}
