"use client";
import { useEffect } from "react";
import { contarVista } from "@/lib/dados";

// Conta uma leitura por artigo e por sessão do browser.
export default function ContarVista({ slug }: { slug: string }) {
  useEffect(() => {
    const chave = `nm-vista-${slug}`;
    try {
      if (sessionStorage.getItem(chave)) return;
      sessionStorage.setItem(chave, "1");
    } catch {}
    contarVista(slug).catch(() => {});
  }, [slug]);
  return null;
}
