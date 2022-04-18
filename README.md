# YPBot

디스코드 채팅 검열/관리 봇

**현재 개발 진행중인 프로젝트 입니다.**

---

## 세팅

1. 클론하기: git에서 클론합니다.
2. 라이브러리 깔기: `yarn` (requirement: yarn)
3. 설정: `config.exmaple.json` 복사해서 `config.json`만들고 채우기
4. DB 세팅하기: `docker compose up -d` (requirement: docker)
5. 프리즈마 세팅하기: `yarn prisma db push`

## 실행

1. DB 서버 실행하기: `docker compose up -d`
2. 디스코드 봇 실행하기(개발용): `yarn dev`
3. 웹사이트 실행하기: `yarn webpack --watch` (`/web`에서)
