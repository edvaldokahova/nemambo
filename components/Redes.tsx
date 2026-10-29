import { Facebook, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import type { Definicoes } from "@/lib/tipos";
import { waLink } from "@/lib/formato";
import WaIcone from "./WaIcone";

function TikTok({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" /></svg>;
}

export function linksRedes(d: Definicoes) {
  return [
    d.whatsapp && { nome: "WhatsApp", href: waLink(d.whatsapp), icon: <WaIcone size={18} /> },
    d.email && { nome: "Email", href: `mailto:${d.email}`, icon: <Mail size={17} strokeWidth={1.6} /> },
    d.linkedin && { nome: "LinkedIn", href: d.linkedin, icon: <Linkedin size={17} strokeWidth={1.6} /> },
    d.facebook && { nome: "Facebook", href: d.facebook, icon: <Facebook size={17} strokeWidth={1.6} /> },
    d.instagram && { nome: "Instagram", href: d.instagram, icon: <Instagram size={17} strokeWidth={1.6} /> },
    d.youtube && { nome: "YouTube", href: d.youtube, icon: <Youtube size={18} strokeWidth={1.6} /> },
    d.tiktok && { nome: "TikTok", href: d.tiktok, icon: <TikTok /> },
  ].filter(Boolean) as { nome: string; href: string; icon: React.ReactNode }[];
}

export default function Redes({ d, claro = false }: { d: Definicoes; claro?: boolean }) {
  const links = linksRedes(d);
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l) => (
        <li key={l.nome}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.nome}
            className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${claro ? "border-papel/20 text-papel hover:bg-papel hover:text-tinta" : "border-tinta/15 text-tinta hover:bg-tinta hover:text-papel"}`}>
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
