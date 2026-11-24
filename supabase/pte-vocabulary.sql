-- User-owned WFD vocabulary cards. All access is mediated by the authenticated Next.js API.
create table if not exists public.pte_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  word text not null check (char_length(word) between 1 and 120),
  word_key text generated always as (lower(btrim(word))) stored,
  meaning text not null default '' check (char_length(meaning) <= 600),
  phonetic text not null default '' check (char_length(phonetic) <= 120),
  audio_url text not null default '' check (char_length(audio_url) <= 1000),
  example text not null default '' check (char_length(example) <= 1200),
  source text not null default 'WFD' check (source in ('WFD','RA','RS','SST','OTHER')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, word_key)
);
alter table public.pte_vocabulary enable row level security;
revoke all on public.pte_vocabulary from anon, authenticated;
grant select, insert, update, delete on public.pte_vocabulary to service_role;
