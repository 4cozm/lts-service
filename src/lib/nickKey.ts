/**
 * 표시용 displayName과 별개로, 유니크 검사용 정규화 키.
 * 유사문자/공백/대소문자 차이를 흡수해 "사실상 같은 닉네임"을 같은 키로.
 */
export function toNickKey(displayName: string): string {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .normalize("NFKC");
}

/** 비회원 닉네임 허용: 영문, 숫자, ? ! . - 만. 공백은 - 로 치환 후 검사. */
const GUEST_NICKNAME_PATTERN = /^[a-zA-Z0-9?!.\-]+$/;

export type ValidateGuestNicknameResult =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

/**
 * 비회원 닉네임 검증 및 정규화.
 * 규칙: 영문만, 띄어쓰기 불가(있으면 - 로 치환), 특수문자 ? ! . 만 허용.
 */
export function validateGuestNickname(nickname: string): ValidateGuestNicknameResult {
  const trimmed = (nickname ?? "").trim();
  if (trimmed.length < 1) {
    return { ok: false, error: "Nickname required" };
  }
  const normalized = trimmed.replace(/\s+/g, "-");
  if (!GUEST_NICKNAME_PATTERN.test(normalized)) {
    return {
      ok: false,
      error: "영문, 숫자, ? ! . - 만 사용 가능하며 띄어쓰기는 - 로 대체됩니다",
    };
  }
  return { ok: true, normalized };
}
