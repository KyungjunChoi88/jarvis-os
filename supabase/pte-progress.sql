-- Supabase SQL Editor에서 1회 실행. 기존 기록은 유지하며 허용 유형을 확장합니다.
create table if not exists public.pte_progress (
 user_id text not null,
 week_start date not null,
 item text not null check(item in ('RA','RS','DI','RT','SGD','R2S','SWT','ESSAY','WFD','memo')),
 day smallint not null check(day between 0 and 6),
 done boolean not null default false,
 memo text not null default '' check(length(memo)<=5000),
 updated_at timestamptz not null default now(),
 primary key(user_id,week_start,item,day),
 check(extract(isodow from week_start)=1)
);
alter table public.pte_progress enable row level security;
revoke all on public.pte_progress from anon, authenticated;
grant select,insert,update on public.pte_progress to service_role;
-- 브라우저 직접 접근 금지. NextAuth 세션을 확인하는 서버 API만 사용합니다.

-- 기존 설치에도 적용 (기록 삭제 없음).
begin;
alter table public.pte_progress drop constraint if exists pte_progress_item_check;
alter table public.pte_progress add constraint pte_progress_item_check check(item in ('RA','RS','DI','RT','SGD','R2S','SWT','ESSAY','WFD','memo'));
commit;
