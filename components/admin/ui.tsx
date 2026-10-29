// Peças pequenas reutilizadas no painel.
export function Titulo({ children, acao }: { children: React.ReactNode; acao?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-serif text-[34px] font-medium leading-none text-tinta sm:text-[40px]">{children}</h1>
      {acao}
    </div>
  );
}

export function Vazio({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-tinta/20 px-6 py-16 text-center text-[15px] text-texto/60">{children}</div>;
}

export function Interruptor({ ligado, onChange, rotulo, ajuda }: { ligado: boolean; onChange: (v: boolean) => void; rotulo: string; ajuda?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button type="button" role="switch" aria-checked={ligado} onClick={() => onChange(!ligado)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${ligado ? "bg-carmim" : "bg-tinta/20"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${ligado ? "left-[22px]" : "left-0.5"}`} />
      </button>
      <span>
        <span className="block text-[15px] text-tinta">{rotulo}</span>
        {ajuda && <span className="block text-[13px] text-texto/55">{ajuda}</span>}
      </span>
    </label>
  );
}

export const caixaAdm = "border border-tinta/10 bg-white";
