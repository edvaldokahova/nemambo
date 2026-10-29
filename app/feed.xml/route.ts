import { SITE_URL, autor, nomeCategoria } from "@/lib/autor";
import { listarArtigos } from "@/lib/dados";
import { textoSimples } from "@/lib/formato";

export const revalidate = 600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Feed RSS: permite seguir o site em leitores de notícias e agregadores.
export async function GET() {
  const artigos = await listarArtigos({ limite: 30 });
  const itens = artigos
    .map((a) => `<item><title>${esc(a.titulo)}</title><link>${SITE_URL}/artigos/${a.slug}</link><guid>${SITE_URL}/artigos/${a.slug}</guid><pubDate>${new Date(a.publicado_em || a.created_at).toUTCString()}</pubDate><category>${esc(nomeCategoria(a.categoria))}</category><description>${esc(a.resumo || textoSimples(a.conteudo).slice(0, 300))}</description></item>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(autor.nome)}</title><link>${SITE_URL}</link><description>${esc(autor.frase)}</description><language>pt</language>${itens}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
