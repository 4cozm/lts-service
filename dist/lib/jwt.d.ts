export declare const JWT_OPTIONS: {
    secret: string;
    sign: {
        expiresIn: string;
    };
};
export type StaffPayload = {
    sub: string;
    type: "staff";
};
