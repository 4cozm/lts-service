import { Writable } from "stream";
export type LogEntry = {
    level: number;
    time: number;
    msg: string;
    [key: string]: unknown;
};
export declare const logBufferStream: Writable;
export declare function getRecentLogs(limit?: number): LogEntry[];
