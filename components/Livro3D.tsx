import Image from "next/image";

// Livro em 3D só com CSS: capa inclinada, lombada com páginas e sombra no chão.
export default function Livro3D({ capa, titulo, priority = false, className = "" }: { capa: string; titulo: string; priority?: boolean; className?: string }) {
  return (
    <div className={`group relative mx-auto w-full max-w-[300px] [perspective:1600px] ${className}`}>
      <div className="relative aspect-[2/3] transition-transform duration-700 ease-out [transform-style:preserve-3d] [transform:rotateY(-24deg)_rotateX(4deg)] group-hover:[transform:rotateY(-12deg)_rotateX(2deg)]">
        {/* páginas (espessura) */}
        <div className="absolute right-0 top-[1.2%] h-[97.6%] w-[34px] origin-right bg-[repeating-linear-gradient(90deg,#f4f1ea_0_1px,#dcd6ca_1px_2px)] [transform:translateX(17px)_translateZ(-17px)_rotateY(90deg)]" aria-hidden />
        {/* contracapa */}
        <div className="absolute inset-0 bg-[#2a2a2a] [transform:translateZ(-34px)]" aria-hidden />
        {/* capa */}
        <div className="absolute inset-0 overflow-hidden rounded-r-[3px] shadow-[inset_4px_0_6px_-2px_rgba(0,0,0,.35)]">
          {capa ? (
            capa.startsWith("/") || capa.startsWith("https://i.ibb.co/") ? (
              <Image src={capa} alt={`Capa do livro ${titulo}`} fill sizes="300px" priority={priority} className="object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={capa} alt={`Capa do livro ${titulo}`} className="absolute inset-0 h-full w-full object-cover" />
            )
          ) : (
            <div className="grid h-full place-items-center bg-tinta p-6 text-center font-serif text-[22px] text-papel">{titulo}</div>
          )}
          {/* vinco da lombada e brilho */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/30 via-white/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15" />
        </div>
      </div>
      <div className="mx-auto -mt-2 h-6 w-[85%] rounded-[50%] bg-black/35 blur-xl" aria-hidden />
    </div>
  );
}
