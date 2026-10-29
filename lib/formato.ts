const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function data(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function dataCurta(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function slugify(t: string) {
  return t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** minutos de leitura (≈ 220 palavras por minuto) */
export function minutosLeitura(texto: string) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 220));
}

/** texto simples, sem marcas de formatação (para descrições e o feed) */
export function textoSimples(md: string) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function soDigitos(t: string) {
  return (t || "").replace(/\D/g, "");
}

/** link do WhatsApp; números de 9 dígitos recebem o indicativo de Angola */
export function waLink(numero: string, msg?: string) {
  let n = soDigitos(numero);
  if (n.length === 9) n = "244" + n;
  return `https://wa.me/${n}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
}
