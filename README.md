# LTS 매장 로컬 서버

Fastify + ioredis + firebase-admin + zod 기반 로컬 서버 뼈대.  
요구사항/아키텍처는 `LTS-local-server-requirements.md`, `LTS-local-server-architecture.md`, `Opus-Bridge-CSharp-Extractor.md` 참고.

## 기능 요약

- **경기 수집(ingest)**: `INGEST_SOURCE=file`(기본)이면 JSONL match 파일을 오프셋 체크포인트로 증분 처리. `INGEST_SOURCE=stream`이면 Redis Stream을 블로킹 구독해 C# 브릿지가 보낸 경기만 처리. match 소스가 변할 때만 players 파일을 읽어 보조 매핑.
- **직원 로그인**: JWT 7일. `.env`의 STAFF_ID/STAFF_PW(테스트용 평문).
- **모바일 닉네임 등록**: 직원 인증 후 닉네임 등록, nickKey 기준 중복 방지.
- **운영 보드**: localhost 전용 무인증, 대기중/게임중/게임종료 드래그&드롭, 당일(KST 00:00)까지 유지.

## 사전 요구사항

- Node.js 20+
- Redis (로컬 `redis://127.0.0.1:6379` 등)
- (선택) Firebase Admin 서비스 계정 JSON

## 설정

```bash
cp env.example .env
# .env에서 PORT, BIND_HOST, MATCH_RESULTS_PATH, PLAYERS_PATH, STAFF_ID, STAFF_PW, JWT_SECRET, REDIS_URL 등 수정
```

## 실행

```bash
# 백엔드 (127.0.0.1:5179)
npm run dev

# 프론트 (별도 터미널, 5180, /api는 5179로 프록시)
npm run dev:web
```

- **직원 로그인**: http://localhost:5180/login  
- **닉네임 등록**(로그인 후): http://localhost:5180/register  
- **운영 보드**(localhost 전용): http://localhost:5180/board  

운영 보드 API(`/api/board`, `/api/board/entries/:id`)는 127.0.0.1에서만 접근 가능합니다.

## Redis Stream + C# 브릿지 (선택)

LiteDB에서 경기를 읽어 Redis Stream으로 보내려면:

1. `.env`에 `INGEST_SOURCE=stream`, `INGEST_STREAM_KEY=lts:match:ingest`, `LITEDB_PATH=...`(경기 원본 DB 경로) 설정.
2. `npm run dev`(또는 `npm start`) 실행 시 Node가 C# 브릿지를 자동으로 같이 띄운다. Node는 스트림을 블로킹 구독하고, C#는 LiteDB 파일 크기 변화를 감지해 슬림 경기 요약을 스트림에 XADD한다. 둘 다 루트 `.env`를 사용한다.
3. 브릿지만 따로 실행하려면: `dotnet run --project ingest-bridge` (프로젝트 루트에서).

## 스크립트

| 스크립트 | 설명 |
|---------|------|
| `npm run dev` | 백엔드 tsx watch (API + ingest) |
| `npm run build` | 백엔드 tsc 빌드 |
| `npm start` | 빌드된 백엔드 실행 |
| `npm run dev:web` | 프론트 Vite 개발 서버 |
