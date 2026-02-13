/**
 * 표시용 displayName과 별개로, 유니크 검사용 정규화 키.
 * 유사문자/공백/대소문자 차이를 흡수해 "사실상 같은 닉네임"을 같은 키로.
 */
export declare function toNickKey(displayName: string): string;
export type ValidateGuestNicknameResult = {
    ok: true;
    normalized: string;
} | {
    ok: false;
    error: string;
};
/**
 * 비회원 닉네임 검증 및 정규화.
 * 규칙: 영문만, 띄어쓰기 불가(있으면 - 로 치환), 특수문자 ? ! . 만 허용.
 */
export declare function validateGuestNickname(nickname: string): ValidateGuestNicknameResult;
