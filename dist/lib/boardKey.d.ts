export declare function getTodayBoardKey(): string;
/** KST 기준 오늘 날짜 문자열 YYYY-MM-DD (당일 필터용) */
export declare function getTodayDateString(): string;
/** createdAt(ISO 문자열)이 KST 기준 오늘인지 여부. 전날 가입 유저 제외용. */
export declare function isCreatedTodayKst(createdAt: string): boolean;
