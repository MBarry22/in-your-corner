import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { startOfDay, setHours, setMinutes, differenceInMinutes } from "date-fns";
import { SEND_WINDOW_MINUTES, APP_TIMEZONE } from "./constants";

export interface SendWindow {
  recipientId: string;
  timezone: string;
  sendHour: number;
  sendMinute: number;
}

/**
 * Check if a recipient is due to receive a message now (within the send window).
 * Uses UTC now and the recipient's timezone + send time.
 */
export function isRecipientDue(window: SendWindow, nowUtc: Date = new Date()): boolean {
  const zonedNow = toZonedTime(nowUtc, window.timezone);
  const todayStart = startOfDay(zonedNow);
  const sendTime = setMinutes(setHours(todayStart, window.sendHour), window.sendMinute);
  const diff = differenceInMinutes(zonedNow, sendTime);
  return diff >= 0 && diff < SEND_WINDOW_MINUTES;
}

/**
 * Get the current hour and minute in a given timezone (for display).
 */
export function getZonedHourMinute(timezone: string, date: Date = new Date()): { hour: number; minute: number } {
  const zoned = toZonedTime(date, timezone);
  return { hour: zoned.getHours(), minute: zoned.getMinutes() };
}

/**
 * "Today" in app timezone (Calgary) as a date-only value for storage/lookup.
 * Use this for daily content so each calendar day in Calgary gets one message.
 */
export function getAppTodayDate(now: Date = new Date()): Date {
  const dateStr = formatInTimeZone(now, APP_TIMEZONE, "yyyy-MM-dd");
  return new Date(dateStr + "T00:00:00.000Z");
}

/**
 * Human-readable label for today in Calgary (e.g. "Monday, March 10, 2025") for AI prompt.
 */
export function getAppTodayLabel(now: Date = new Date()): string {
  return formatInTimeZone(now, APP_TIMEZONE, "EEEE, MMMM d, yyyy");
}

/**
 * Day of week in Calgary (e.g. "Monday") for AI — so the model never invents the wrong day.
 */
export function getAppDayOfWeek(now: Date = new Date()): string {
  return formatInTimeZone(now, APP_TIMEZONE, "EEEE");
}
