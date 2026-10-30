-- Ponto Certo: esquema do banco PostgreSQL (ex.: Neon).
-- Pode ser executado várias vezes: usa "if not exists".

create table if not exists usuarios (
  id          serial primary key,
  email       text not null unique,
  nome        text not null,
  senha_hash  text not null,
  criado_em   timestamptz not null default now()
);

-- Guarda apenas o hash (SHA-256) do token da sessão, nunca o token em si.
create table if not exists sessoes (
  token_hash  text primary key,
  usuario_id  integer not null references usuarios(id) on delete cascade,
  expira_em   timestamptz not null,
  criado_em   timestamptz not null default now()
);

create index if not exists sessoes_usuario_idx on sessoes (usuario_id);
create index if not exists sessoes_expira_idx on sessoes (expira_em);

create table if not exists favoritos (
  usuario_id  integer not null references usuarios(id) on delete cascade,
  linha_id    text not null,
  criado_em   timestamptz not null default now(),
  primary key (usuario_id, linha_id)
);
