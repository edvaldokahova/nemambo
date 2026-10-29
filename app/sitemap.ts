import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/autor";
import { listarArtigos, listarLivros } from "@/lib/dados";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [artigos, livros] = await Promise.all([listarArtigos({ limite: 1000 }), listarLivros()]);
  const agora = new Date();
  return [
    { url: SITE_URL, lastModified: agora, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/artigos`, lastModified: agora, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/livros`, lastModified: agora, priority: 0.9 },
    { url: `${SITE_URL}/sobre`, lastModified: agora, priority: 0.8 },
    ...livros.map((l) => ({ url: `${SITE_URL}/livros/${l.slug}`, lastModified: new Date(l.created_at), priority: 0.9 })),
    ...artigos.map((a) => ({ url: `${SITE_URL}/artigos/${a.slug}`, lastModified: new Date(a.updated_at), priority: 0.7 })),
  ];
}
