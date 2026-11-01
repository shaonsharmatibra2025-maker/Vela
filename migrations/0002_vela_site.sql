create table if not exists vela_site (
  id text primary key,
  doc text not null,
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists vela_admin (
  id text primary key,
  pass_hash text not null,
  updated_at timestamptz not null default now()
);
