// Assinatura do site: nome em serifa com o ponto carmim.
export default function Logo({ claro = false, className = "" }: { claro?: boolean; className?: string }) {
  return (
    <span className={`font-serif text-[22px] font-medium tracking-[-0.01em] sm:text-[24px] ${claro ? "text-papel" : "text-tinta"} ${className}`}>
      Pedro Nemambo<span className="text-carmim">.</span>
    </span>
  );
}
