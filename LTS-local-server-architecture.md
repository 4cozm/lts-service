# LTS 매장 로컬 서버 아키텍처(뼈대)

## 프로세스 역할
### 1) Ingest
- 입력: matchResults.jsonl
- 트리거: 파일 mtime/size 변화(참고용)
- 정합성: `offset checkpoint`로 증분 읽기
- 출력: match 단위 이벤트(신규 match)

### 2) Derive/Index(최소)
- 원본 match에서 OP.GG 스타일 최소 조회를 위해 아래 인덱스를 생성/업로드:
  - match 원본(또는 슬림)
  - 유저별 최근 경기 카드 요약
  - 레이팅 이벤트(스키마만 먼저)
- Player 파일은 match 변화 시점에만 읽어 “현재 매핑 정보”를 보조로 얻는 용도

### 3) State(보드/등록)
- Redis에 저장:
  - match 오프셋 checkpoint
  - nickname registry (nickKey unique)
  - entries(board 상태): waiting/playing/done + createdAt
  - users/members/guests 최소 엔티티
- 리셋:
  - KST 00:00 기준으로 “당일 보드” 분리 키 사용 권장 (e.g., board:2026-02-06)

### 4) API/UI
- 모바일 등록 UI:
  - staff 로그인(JWT 7일)
  - guest/member signup/login(OTP는 스켈레톤)
- 직원 보드 UI:
  - localhost only
  - 무인증
  - 드래그&드롭으로 상태 변경 API 호출

## 네트워크 바인딩
- 서버는 127.0.0.1에 바인딩(외부 접속 차단)

## 멱등의 핵심
- JSONL append-only + 종료 후 불변 → offset checkpoint가 곧 멱등
- matchId unique는 2차 방어선

## PlayerId 한계 대응
- PlayerId는 재사용 가능 → 영구 식별자로 사용 금지
- 운영은 닉네임 기반이므로, nickKey 정규화 + 유니크 정책이 본질
- LiteDB에 필드 추가가 안전하다면 내부 보조키를 추가하는 것은 가능하지만, 직원 식별 문제를 해결하진 못함(기록 결합 안정화 정도)

