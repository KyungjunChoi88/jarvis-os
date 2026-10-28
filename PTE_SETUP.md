# PTE 공부 기록 통합 저장
기존 Google 로그인을 재사용하며 /pte/checklist 에서 사용합니다.
1. 기존 Supabase 프로젝트의 SQL Editor에서 supabase/pte-progress.sql 실행.
2. Vercel 프로젝트에 SUPABASE_URL 및 SUPABASE_SERVICE_ROLE_KEY를 서버 환경변수로 설정.
   SUPABASE_URL은 기존 프로젝트 URL입니다. 서비스 역할 키는 Supabase 대시보드에서 확인합니다.
   NEXT_PUBLIC_ 접두사를 붙이지 말고, 키를 코드나 채팅에 붙여넣지 마세요.
3. 재배포 후 Google 로그인. 체크 저장 후 다른 기기에서 동일 계정으로 접속해 확인.
서버는 NextAuth의 검증된 이메일을 사용해 모든 조회와 저장을 제한합니다.
테이블은 RLS를 켜고 브라우저 역할의 접근을 차단합니다. 서비스 키는 서버에서만 사용합니다.
기존 메모/일정/학습 파일과 테이블은 변경하지 않습니다.
항목별 저장이므로 다른 체크 항목을 변경할 때 주간 전체 기록을 덮어쓰지 않습니다.
메모는 명시적으로 저장합니다. 저장 실패 시 화면에 실패 표시 및 재시도 버튼을 제공합니다.
