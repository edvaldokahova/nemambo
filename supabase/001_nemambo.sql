-- ============================================================
-- NEMAMBO — correr UMA vez no SQL Editor do Supabase partilhado
-- (o mesmo projecto da NK Luzindalalu, REDE 29, Carvieal, etc.)
-- Cria o site, as tabelas de artigos/livros/leitores, as regras
-- de segurança (RLS) e as funções públicas (vistas, cliques, newsletter).
-- ============================================================

-- 1) Site e definições editáveis ---------------------------------------
insert into stores (slug, name)
select 'nemambo', 'Pedro Nemambo'
where not exists (select 1 from stores where slug = 'nemambo');

insert into store_content (store_id, data)
select s.id, '{}'::jsonb
from stores s
where s.slug = 'nemambo'
  and not exists (select 1 from store_content c where c.store_id = s.id);

-- 2) Tabelas ----------------------------------------------------------
create table if not exists nemambo_artigos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  resumo text not null default '',
  conteudo text not null default '',            -- texto com formatação simples (## título, **negrito**, > citação…)
  capa text not null default '',                -- link da imagem (ImgBB)
  categoria text not null default 'artigos' check (categoria in ('artigos','ideias','opinioes')),
  fixado boolean not null default false,        -- o artigo que abre a página inicial
  publicado boolean not null default false,
  publicado_em timestamptz,
  vistas int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists nemambo_artigos_pub_idx on nemambo_artigos (publicado, publicado_em desc);

create table if not exists nemambo_livros (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  subtitulo text not null default '',
  descricao text not null default '',
  capa text not null default '',
  preco_texto text not null default '',         -- ex.: "15 000 Kz" (livre)
  link_compra text not null default '',         -- link da plataforma onde se compra
  texto_botao text not null default 'Comprar o livro',
  edicao text not null default '',
  editora text not null default '',
  paginas text not null default '',
  isbn text not null default '',
  destaque boolean not null default false,
  ativo boolean not null default true,
  ordem int not null default 0,
  cliques int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists nemambo_leitores (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null default '',
  origem text not null default '',
  created_at timestamptz not null default now()
);

-- 3) Quem gere o site --------------------------------------------------
create or replace function nemambo_e_gerente() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from store_members m join stores s on s.id = m.store_id
    where s.slug = 'nemambo' and m.user_id = auth.uid()
  );
$$;

-- 4) Regras de segurança (RLS) -----------------------------------------
alter table nemambo_artigos enable row level security;
alter table nemambo_livros  enable row level security;
alter table nemambo_leitores enable row level security;

drop policy if exists nemambo_artigos_ler on nemambo_artigos;
create policy nemambo_artigos_ler on nemambo_artigos for select using (publicado or nemambo_e_gerente());
drop policy if exists nemambo_artigos_gerir on nemambo_artigos;
create policy nemambo_artigos_gerir on nemambo_artigos for all using (nemambo_e_gerente()) with check (nemambo_e_gerente());

drop policy if exists nemambo_livros_ler on nemambo_livros;
create policy nemambo_livros_ler on nemambo_livros for select using (ativo or nemambo_e_gerente());
drop policy if exists nemambo_livros_gerir on nemambo_livros;
create policy nemambo_livros_gerir on nemambo_livros for all using (nemambo_e_gerente()) with check (nemambo_e_gerente());

drop policy if exists nemambo_leitores_gerir on nemambo_leitores;
create policy nemambo_leitores_gerir on nemambo_leitores for all using (nemambo_e_gerente()) with check (nemambo_e_gerente());

-- 5) Funções públicas (o visitante só consegue fazer isto) -------------
create or replace function nemambo_contar_vista(p_slug text) returns void
language sql security definer set search_path = public as $$
  update nemambo_artigos set vistas = vistas + 1 where slug = p_slug and publicado;
$$;

create or replace function nemambo_contar_clique(p_id uuid) returns void
language sql security definer set search_path = public as $$
  update nemambo_livros set cliques = cliques + 1 where id = p_id and ativo;
$$;

create or replace function nemambo_subscrever(p_email text, p_nome text default '', p_origem text default '') returns void
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(coalesce(p_email, '')));
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 200 then
    raise exception 'Email inválido.';
  end if;
  insert into nemambo_leitores (email, nome, origem)
  values (v_email, left(trim(coalesce(p_nome, '')), 120), left(coalesce(p_origem, ''), 120))
  on conflict (email) do nothing;
end;
$$;

revoke all on function nemambo_contar_vista(text) from public;
revoke all on function nemambo_contar_clique(uuid) from public;
revoke all on function nemambo_subscrever(text, text, text) from public;
grant execute on function nemambo_contar_vista(text) to anon, authenticated;
grant execute on function nemambo_contar_clique(uuid) to anon, authenticated;
grant execute on function nemambo_subscrever(text, text, text) to anon, authenticated;
grant execute on function nemambo_e_gerente() to anon, authenticated;

grant select on nemambo_artigos, nemambo_livros to anon, authenticated;
grant insert, update, delete on nemambo_artigos, nemambo_livros to authenticated;
grant select, delete on nemambo_leitores to authenticated;

-- 6) O livro (o link de compra coloca-se depois no painel) -------------
insert into nemambo_livros (slug, titulo, subtitulo, descricao, capa, edicao, editora, destaque, ordem)
select
  'contributo-da-comunicacao',
  'Contributo da Comunicação',
  'No desenvolvimento das instituições públicas em Angola: seu valor na dinâmica de uma comunicação fluida',
  'Como é que uma instituição pública fala com os cidadãos, e o que perde quando não o faz bem? Neste livro, Pedro Nemambo, jornalista, mestre em Ciência Política e Administração Pública e chefe de comunicação no sector público, mostra porque a comunicação não é um acessório da administração: é uma das forças que a fazem funcionar.

Escrito a partir da experiência de quem trabalha por dentro das instituições, o livro analisa o papel da comunicação na transparência, na confiança e na eficácia dos serviços públicos em Angola, e defende uma comunicação fluida, que circula dentro das organizações e chega com clareza a quem servem.

Para gestores e funcionários públicos, profissionais e estudantes de comunicação, ciência política e administração pública, e para todos os que querem instituições mais próximas das pessoas.',
  '/img/livro-contributo.webp',
  '1.ª edição',
  'Editora Nemambo',
  true,
  1
where not exists (select 1 from nemambo_livros where slug = 'contributo-da-comunicacao');
