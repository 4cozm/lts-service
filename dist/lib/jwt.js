import { config } from "../config.js";
export const JWT_OPTIONS = {
    secret: config.JWT_SECRET,
    sign: {
        expiresIn: config.JWT_EXPIRES_IN,
    },
};
