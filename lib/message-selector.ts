import { prisma } from "./prisma";
import { getDailyContentForDate } from "./daily-content";
import { getAppTodayDate } from "./timezone";
import { COOLDOWN_DAYS, SMS_MAX_LENGTH } from "./constants";
import { startOfDay, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface SelectResult {
  templateId: string | null;
  body: string;
}

/**
 * Select message for a recipient: prefer today's AI-generated daily content if present,
 * otherwise choose an active template with cooldown.
 * Resources are not appended to SMS (carriers can block or drop long/multi-URL messages).
 */
export async function selectMessageForRecipient(recipientId: string): Promise<SelectResult | null> {
  const todayApp = getAppTodayDate();
  const daily = await getDailyContentForDate(todayApp);
  if (daily?.messageBody?.trim()) {
    const body =
      daily.messageBody.length > SMS_MAX_LENGTH
        ? daily.messageBody.trim().slice(0, SMS_MAX_LENGTH - 3) + "..."
        : daily.messageBody.trim();
    return { templateId: null, body };
  }

  const timezone = await prisma.recipient.findUnique({
    where: { id: recipientId },
    select: { timezone: true },
  });
  if (!timezone) return null;

  const now = new Date();
  const zonedNow = toZonedTime(now, timezone.timezone);
  const cutoff = subDays(startOfDay(zonedNow), COOLDOWN_DAYS);

  const recentLogs = await prisma.messageLog.findMany({
    where: {
      recipientId,
      templateId: { not: null },
      sentAt: { gte: cutoff },
    },
    select: { templateId: true, sentAt: true },
    orderBy: { sentAt: "desc" },
  });

  const recentlyUsedTemplateIds = new Set(recentLogs.map((l) => l.templateId).filter(Boolean) as string[]);

  const activeTemplates = await prisma.messageTemplate.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  if (activeTemplates.length === 0) return null;

  const notRecentlyUsed = activeTemplates.filter((t) => !recentlyUsedTemplateIds.has(t.id));

  let chosen = notRecentlyUsed[0] ?? null;
  if (!chosen) {
    const lastUsed = recentLogs[0];
    if (lastUsed?.templateId) {
      const leastRecent = activeTemplates.find((t) => t.id === lastUsed.templateId) ?? activeTemplates[0];
      chosen = leastRecent;
    } else {
      chosen = activeTemplates[0];
    }
  }

  const rawBody = chosen.body.trim();
  const body =
    rawBody.length > SMS_MAX_LENGTH ? rawBody.slice(0, SMS_MAX_LENGTH - 3) + "..." : rawBody;

  return {
    templateId: chosen.id,
    body,
  };
}
