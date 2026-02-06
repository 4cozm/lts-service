# Opus용 정리: C# Extractor(경량) ↔ Node.js 로컬 서버 브릿지 설계

## 왜 C# Extractor가 필요한가
- 원본 데이터가 `.data` 파일이며, 내부가 **LiteDB(임베디드 .NET DB) 기반**일 가능성이 높다.
- LiteDB는 “서버에 붙는 DB”가 아니라 **.NET 라이브러리가 파일을 직접 읽고/쓰기** 하는 방식이라,
  Node.js에서 드라이버로 직접 쿼리/파싱하는 경로가 사실상 없다.
- 따라서 **원본 해석(읽기)** 은 C#에 고정하고, Node.js는 오케스트레이션(멱등/업로드/UI)을 담당한다.

핵심 분리:
- **C#**: `.data → (match JSONL / player JSON) 추출` (파일 해석 전용 드라이버)
- **Node.js**: 트리거/멱등/Redis·Firebase 업로드/UI 제공 (기록 엔진)

---

## 전체 흐름(메커니즘)
1) Node가 `matchResults.jsonl`(또는 추출 결과 파일)의 변경을 감지한다.  
2) 변경이 감지되면 Node가 **C# Extractor를 단발 실행**한다.  
3) C# Extractor는 `.data`를 열어 필요한 데이터만 읽고, **표준 출력(stdout) 또는 출력 파일**로 결과를 내보낸다.  
4) Node는 결과를 **오프셋 체크포인트** 기반으로 증분 ingest(멱등)하고,
   - 로컬 Redis에 상태 저장
   - Firebase에 OP.GG 스타일용 “최소 인덱스”만 업로드한다.

권장: Extractor는 “증분”을 책임지지 말고, Node가 checkpoint로 멱등을 책임진다.

---

## Extractor 실행 방식(권장: 단발 실행)
- 상주 서비스(gRPC/HTTP)도 가능하지만 초기 스코프에서는 장애 면적이 커지므로 **단발 실행이 가장 단순/견고**하다.
- Node는 파일 변경 시 `dotnet extractor.dll ...` 또는 `extractor.exe ...` 형태로 실행한다.

### 장점
- 상태 꼬임이 적음(프로세스가 매번 깨끗하게 시작/종료)
- 배포/운영이 단순
- 로그/에러 처리 명확

---

## Extractor 인터페이스(계약) 제안

### 입력(필수)
- `--dbPath <path>` : `.data` 파일 경로
- `--outDir <path>` : 결과 파일 출력 디렉터리
- (선택) `--mode matches|players|all` : 어떤 결과를 뽑을지

### 출력(권장: 파일 출력)
- `<outDir>/matches.jsonl` : match 1개 = JSON 1줄(JSONL)
- `<outDir>/players.json` : 플레이어(현재 스냅샷) JSON
- `<outDir>/meta.json` : 추출 시각/버전/통계(선택)

Node 쪽 요구사항과 일치:
- match 결과는 append-only JSONL 형태로 다루기 좋음
- Node는 `matches.jsonl`을 오프셋 checkpoint로 “새로 추가된 줄만” 처리 가능

### 출력(대안: stdout 스트리밍)
- Extractor가 JSONL을 stdout으로 내보내고 Node가 pipe로 라인 단위 ingest 가능
- 다만 Windows 서비스 운영에서는 파일 출력이 디버깅/재시작 복구에 유리

### 종료 코드
- `0`: 성공
- `2`: 입력 파일 없음/열기 실패
- `3`: 파싱 실패(치명)
- `10`: 부분 성공(예: players만 성공, matches 실패) 등은 필요 시 정의

### 로그
- stdout은 데이터(JSONL), stderr는 로그(pino와 같은 역할)
- 또는 `--logPath`로 로그 파일 지정(선택)

---

## Node ↔ Extractor 책임 경계(중요)
### Extractor 책임(최소)
- `.data` 해석: LiteDB 열기/컬렉션 읽기/필드 파싱
- 결과를 JSON/JSONL로 serialize하여 제공

### Node 책임(핵심)
- **멱등**: 오프셋 checkpoint / matchId unique
- 트리거: 파일 폴링/mtime 변화 감지
- 업로드: Redis/Firebase upsert, 재시도, 실패 큐잉
- UI: 직원 로그인(JWT 7일), 모바일 등록, localhost 운영 보드

---

## 멱등 모델(권장)
- Node는 `matches.jsonl`에 대해 다음을 유지:
  - `checkpoint:matchesOffset` (바이트 오프셋)
- 파일 크기 증가 시 offset부터 EOF까지 읽고,
  - 각 줄 parse → `match.Id` 유니크로 2차 방어
- “종료 후 정정 없음” 전제이므로 match는 once-write

Players 처리:
- 요구사항: **match 파일이 변할 때만** players를 읽는다
- players는 스냅샷 성격이므로:
  - `playersHash`(전체 해시) 저장 후 동일하면 업로드 스킵 가능

---

## OP.GG 스타일 대비: Firebase 최소 인덱스(뼈대)
고객용 페이지 구현은 지금 범위 밖. 단, Cloud Function이 나중에 정제를 하려면 최소 데이터가 필요하다.

필수 3축 업로드:
1) `matches/{matchId}`  
   - finishedAt, mode/name, winSide, teamScores, players 주요 지표 등(원본 또는 슬림)
2) `user_matches/{userRef}/{finishedAt_matchId}`  
   - 유저별 최근 경기 “카드” 요약(승패/내 스탯/팀스코어)
3) `rating_events/{userRef}/{ts_matchId}`  
   - 레이팅 추이(지금은 스키마만 마련 가능)

---

## 배포/운영 권장안
- Redis/Postgres 등 DB는 Docker로 띄운다.
- Extractor는 초기엔 컨테이너화보다 **윈도우에서 exe로 동작**시키는 게 안정적(호스트 파일 경로/권한 문제 감소).
- Node 서버는 127.0.0.1 바인딩(localhost 전용)으로 운영.

---

## 보안/운영 전제(테스트 스코프)
- STAFF_ID/STAFF_PW는 `.env`에 평문 저장(테스트 목적)
- 직원 로그인 성공 시 JWT 7일 발급
- 운영 보드 페이지는 localhost 무인증(같은 PC에서만 접속)

---

## 구현 체크(Extractor가 만족해야 하는 최소 조건)
- `.data` 열기 실패 시 명확한 에러/종료 코드 제공
- 결과 JSONL은 “한 줄 = 한 match JSON”을 보장(개행 포함 데이터 금지)
- match.Id는 반드시 포함(유니크 키)
- (가능하면) finishedAt/finishTime 포함(후속 인덱싱에 필요)

