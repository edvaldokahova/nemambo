import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, autor } from "@/lib/autor";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const titulo = `${autor.nome} — ${autor.funcao}`;
const descricao = `Artigos, ideias e opiniões de ${autor.nome} sobre comunicação, administração pública e Angola. Autor do livro «Contributo da Comunicação no desenvolvimento das instituições públicas em Angola».`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: titulo, template: `%s | ${autor.nome}` },
  description: descricao,
  authors: [{ name: autor.nome, url: SITE_URL }],
  creator: autor.nome,
  alternates: { canonical: "/", types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: { type: "website", locale: "pt_AO", siteName: autor.nome, title: titulo, description: descricao, url: SITE_URL, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: autor.nome }] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0F1A29", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
