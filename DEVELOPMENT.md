# Jarvis OS Development Guide

## 기준 저장소

- GitHub 원격 저장소가 Jarvis OS의 기준 저장소입니다.
- 현재 기준 원격은 `https://github.com/KyungjunChoi88/jarvis-os.git` 입니다.
- 작업 전에는 반드시 프로젝트 루트에서 `pwd`, `git remote -v`, `git branch`, `git status`를 확인합니다.

## 프로젝트 원칙

- Codex는 새 프로젝트를 만들지 않습니다.
- 모든 기능 변경은 GitHub 원격과 연결된 기존 Jarvis OS 프로젝트 루트에서만 진행합니다.
- 현재 배포 프로젝트 루트는 이 `outputs` 디렉터리입니다.
- 기존 Jarvis OS 화면과 디자인을 유지하면서 기능을 추가합니다.

## 환경변수

Vercel Project Settings에 아래 값을 등록합니다.

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Google OAuth 리디렉션 URI는 `NEXTAUTH_URL/api/auth/callback/google` 형식으로 등록합니다.

## 배포 절차

1. GitHub 기준 프로젝트 루트에서 작업합니다.
2. `npm install`로 의존성을 동기화합니다.
3. `npm run build`가 성공하는지 확인합니다.
4. `git status`로 변경 파일을 확인합니다.
5. 의미 있는 커밋을 생성합니다.
6. `git push origin main`으로 GitHub에 반영합니다.
7. Vercel 자동 배포가 시작되는지 확인합니다.

## 작업 완료 체크리스트

- [ ] 실제 GitHub 원격이 연결된 프로젝트 루트에서 작업했는지 확인
- [ ] 기존 Jarvis OS 화면 유지 확인
- [ ] 필요한 환경변수 목록 확인
- [ ] `npm run build` 성공
- [ ] `git status` 확인
- [ ] 커밋 생성
- [ ] GitHub push 완료
- [ ] Vercel 자동 배포 트리거 확인
