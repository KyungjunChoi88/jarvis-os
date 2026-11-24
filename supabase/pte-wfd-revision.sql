-- Persist user-selected difficult WFD sentences independently of monthly banks.
create table if not exists public.pte_wfd_revision (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  sentence_key text not null check (char_length(sentence_key) between 1 and 500),
  sentence_id integer not null check (sentence_id > 0),
  sentence text not null check (char_length(sentence) between 1 and 1200),
  meaning text not null default '' check (char_length(meaning) <= 1600),
  stars text not null default '',
  audio_url text not null default '' check (char_length(audio_url) <= 1000),
  source_revision text not null default '',
  consecutive_correct smallint not null default 0 check (consecutive_correct between 0 and 3),
  memorized boolean not null default false,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sentence_key)
);
alter table public.pte_wfd_revision enable row level security;
revoke all on public.pte_wfd_revision from anon, authenticated;
grant select, insert, update, delete on public.pte_wfd_revision to service_role;
