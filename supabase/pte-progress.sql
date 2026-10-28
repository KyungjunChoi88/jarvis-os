-- Supabase SQL Editor에서 1회 실행. 기존 테이블은 변경하지 않습니다.
create table if not exists public.pte_progress (
 user_id text not null,
 week_start date not null,
 item text not null check(item in ('RA','RS','DI','RT','SGD','SWT','WFD','memo')),
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
