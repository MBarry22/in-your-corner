export const COOLDOWN_DAYS = 14;
export const SMS_MAX_LENGTH = 320;
export const SEND_WINDOW_MINUTES = 15;

/** App uses Calgary time for "today" and daily content. Override with APP_TIMEZONE env if needed. */
export const APP_TIMEZONE = process.env.APP_TIMEZONE || "America/Edmonton";
