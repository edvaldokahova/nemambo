# Pedro Nemambo — site pessoal, blogue e livros (nemambo.com)

Artigos, ideias e opinião; página do autor; venda dos livros com botão que leva à plataforma de pagamento; newsletter; painel de gestão.

## Pôr a funcionar (uma vez)

1. **Supabase partilhado** → SQL Editor → correr `supabase/001_nemambo.sql` (cria o site, as tabelas, as regras e o livro).
2. Authentication → Users → *Add user* com o email do Pedro (marcar *Auto Confirm*). **Só depois** trocar o email em `supabase/002_ligar_gerente.sql` e correr.
3. **Vercel** → *Add New → Project* → importar `nemambo` → *Environment Variables*:
   - `NEXT_PUBLIC_SUPABASE_URL` (o mesmo dos outros projectos)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (a mesma chave pública)
   - `NEXT_PUBLIC_SITE_URL` = `https://nemambo.com`
4. Vercel → Settings → Domains → adicionar `nemambo.com` e `www.nemambo.com` e copiar os registos DNS que a Vercel mostrar para o fornecedor do domínio.
5. Painel: `nemambo.com/admin/entrar`.

## No painel

| Quero… | Onde |
|---|---|
| Escrever/publicar um artigo, escolher o que abre a página inicial | Artigos → «Destacar na página inicial» |
| Colocar o link onde o livro é vendido, preço, texto do botão | Livros → Venda |
| Ver leituras e cliques em «Comprar» | Resumo |
| Ver e copiar os emails da newsletter | Leitores |
| WhatsApp, email e redes sociais | Definições |

Sem link de compra, o botão do livro abre o WhatsApp do Pedro com a mensagem pronta.

Imagens dos artigos: links directos do ImgBB, horizontais (1600 × 900).

## SEO

Títulos e descrições por página, imagem de partilha (`public/og.jpg`), dados estruturados (Pessoa, Artigo, Livro), `sitemap.xml`, `robots.txt` e feed RSS (`/feed.xml`). Depois do domínio activo, registar o site no Google Search Console e enviar `https://nemambo.com/sitemap.xml`.

## Textos fixos

Biografia, formação, percurso e serviços: `lib/autor.ts`.
