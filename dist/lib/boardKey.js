export function getTodayBoardKey() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const y = kst.getUTCFullYear();
    const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const d = String(kst.getUTCDate()).padStart(2, "0");
    return `board:${y}-${m}-${d}`;
}
/** KST 기준 오늘 날짜 문자열 YYYY-MM-DD (당일 필터용) */
export function getTodayDateString() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const y = kst.getUTCFullYear();
    const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const d = String(kst.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
/** createdAt(ISO 문자열)이 KST 기준 오늘인지 여부. 전날 가입 유저 제외용. */
export function isCreatedTodayKst(createdAt) {
    const d = new Date(createdAt);
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().slice(0, 10) === getTodayDateString();
}
