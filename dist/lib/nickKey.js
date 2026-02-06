/**
 * 표시용 displayName과 별개로, 유니크 검사용 정규화 키.
 * 유사문자/공백/대소문자 차이를 흡수해 "사실상 같은 닉네임"을 같은 키로.
 */
export function toNickKey(displayName) {
    return displayName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\u00a0/g, " ")
        .normalize("NFKC");
}
