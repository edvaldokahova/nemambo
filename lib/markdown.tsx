// Formatação simples dos artigos, sem HTML (seguro contra código malicioso).
//   ## Título          ### Subtítulo        > Citação
//   **negrito**        *itálico*            [texto](https://link)
//   - item de lista    1. item numerado     ![legenda](https://imagem)
//   ---  (separador)   linha vazia = novo parágrafo
import type { ReactNode } from "react";

const seguro = (u: string) => (/^(https?:\/\/|\/|mailto:)/i.test(u.trim()) ? u.trim() : "#");

function inline(t: string, k = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let ult = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(t))) {
    if (m.index > ult) out.push(t.slice(ult, m.index));
    const key = `${k}-${n++}`;
    if (m[1]) {
      const href = seguro(m[2]);
      const externo = /^https?:/i.test(href);
      out.push(<a key={key} href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inline(m[1], key)}</a>);
    } else if (m[3]) out.push(<strong key={key}>{inline(m[3], key)}</strong>);
    else if (m[4]) out.push(<em key={key}>{m[4]}</em>);
    ult = re.lastIndex;
  }
  if (ult < t.length) out.push(t.slice(ult));
  return out;
}

function comQuebras(t: string, k: string): ReactNode[] {
  return t.split("\n").flatMap((l, i) => (i ? [<br key={`${k}-br${i}`} />, ...inline(l, `${k}-${i}`)] : inline(l, `${k}-${i}`)));
}

export function Markdown({ texto, capitular = false }: { texto: string; capitular?: boolean }) {
  const blocos = (texto || "").replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const nos: ReactNode[] = [];
  blocos.forEach((b, i) => {
    const k = `b${i}`;
    const linhas = b.split("\n");
    const img = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      nos.push(
        <figure key={k}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={seguro(img[2])} alt={img[1]} loading="lazy" />
          {img[1] && <figcaption>{img[1]}</figcaption>}
        </figure>,
      );
    } else if (/^---+$/.test(b)) nos.push(<hr key={k} />);
    else if (b.startsWith("### ")) nos.push(<h3 key={k}>{inline(b.slice(4), k)}</h3>);
    else if (b.startsWith("## ")) nos.push(<h2 key={k}>{inline(b.slice(3), k)}</h2>);
    else if (b.startsWith("# ")) nos.push(<h2 key={k}>{inline(b.slice(2), k)}</h2>);
    else if (linhas.every((l) => l.startsWith(">"))) nos.push(<blockquote key={k}>{comQuebras(linhas.map((l) => l.replace(/^>\s?/, "")).join("\n"), k)}</blockquote>);
    else if (linhas.every((l) => /^[-*]\s+/.test(l))) nos.push(<ul key={k}>{linhas.map((l, j) => <li key={j}>{inline(l.replace(/^[-*]\s+/, ""), `${k}-${j}`)}</li>)}</ul>);
    else if (linhas.every((l) => /^\d+[.)]\s+/.test(l))) nos.push(<ol key={k}>{linhas.map((l, j) => <li key={j}>{inline(l.replace(/^\d+[.)]\s+/, ""), `${k}-${j}`)}</li>)}</ol>);
    else nos.push(<p key={k}>{comQuebras(b, k)}</p>);
  });
  return <div className={`prosa ${capitular ? "capitular" : ""}`}>{nos}</div>;
}
