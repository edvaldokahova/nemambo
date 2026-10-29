-- ============================================================
-- LIGAR O PEDRO NEMAMBO AO PAINEL
-- 1) PRIMEIRO: Supabase > Authentication > Users > "Add user" > "Create new user":
--    email do Pedro + uma senha. Marque "Auto Confirm User".
-- 2) DEPOIS: troque o email abaixo pelo MESMO email e corra este ficheiro.
-- ============================================================

insert into store_members (store_id, user_id, role)
select s.id, u.id, 'gerente'
from stores s, auth.users u
where s.slug = 'nemambo'
  and lower(u.email) = lower('EMAIL_DO_PEDRO@exemplo.com')
  and not exists (select 1 from store_members m where m.store_id = s.id and m.user_id = u.id);

-- Confirmação (deve aparecer uma linha com o email):
select s.slug, u.email, m.role
from store_members m join stores s on s.id = m.store_id join auth.users u on u.id = m.user_id
where s.slug = 'nemambo';
