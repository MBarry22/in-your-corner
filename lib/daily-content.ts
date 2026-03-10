import { prisma } from "./prisma";
import { generateDailyContent } from "./openai";
import { getAppTodayDate, getAppTodayLabel, getAppDayOfWeek } from "./timezone";

// Prisma client may not have dailyContent until after "prisma generate" (schema includes DailyContent).
// Cast to any so Prisma delegate calls (findUnique/upsert with contentDate) are not type-checked as Recipient.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dailyContent = (prisma as any).dailyContent as any;

/** Shape of a DailyContent row (for typing when Prisma client type isn't available). */
export type DailyContentRow = {
  id: string;
  contentDate: Date;
  messageBody: string;
  resources: string | null;
  promptUsed: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Get stored daily content for a given calendar date (use getAppTodayDate() for "today" in Calgary).
 */
export async function getDailyContentForDate(date: Date): Promise<DailyContentRow | null> {
  if (!dailyContent) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dailyContent.findUnique({ where: { contentDate: date } as any }) as Promise<DailyContentRow | null>;
}

/**
 * Ensure we have daily content for today (Calgary time). If not, generate via AI and store it.
 * Set forceRegenerate true when the user clicks "Generate with AI" so we always create a fresh message.
 */
export async function ensureDailyContentForToday(
  customPrompt?: string,
  forceRegenerate?: boolean
): Promise<{ messageBody: string; resources: string | null } | null> {
  if (!dailyContent) return null;

  const today = getAppTodayDate();
  if (!forceRegenerate) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await dailyContent.findUnique({ where: { contentDate: today } as any });
    if (existing) return existing;
  }

  const useAI = process.env.USE_AI_DAILY_MESSAGE === "true" && process.env.OPENAI_API_KEY;
  if (!useAI) return null;

  const generated = await generateDailyContent(
    customPrompt,
    getAppTodayLabel(),
    getAppDayOfWeek()
  );
  if (!generated) return null;

  const resourcesJson = JSON.stringify(generated.resources);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await dailyContent.upsert({
    where: { contentDate: today } as any,
    create: {
      contentDate: today,
      messageBody: generated.message,
      resources: resourcesJson,
      promptUsed: customPrompt ?? null,
    },
    update: {
      messageBody: generated.message,
      resources: resourcesJson,
      promptUsed: customPrompt ?? null,
    },
  } as any);

  return { messageBody: generated.message, resources: resourcesJson };
}

/**
 * Generate today's message + resources via AI without saving. For preview/testing.
 */
export async function generateOnlyTodayContent(
  customPrompt?: string
): Promise<{ messageBody: string; resources: { id: string; title: string; url: string; note?: string }[] } | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const generated = await generateDailyContent(
    customPrompt,
    getAppTodayLabel(),
    getAppDayOfWeek()
  );
  if (!generated) return null;

  return {
    messageBody: generated.message,
    resources: generated.resources,
  };
}

/**
 * Save provided message + resources as today's content (Calgary date). For saving a preview.
 */
export async function saveTodayContent(
  messageBody: string,
  resources: { id: string; title: string; url: string; note?: string }[]
): Promise<boolean> {
  if (!dailyContent) return false;
  const today = getAppTodayDate();
  const resourcesJson = JSON.stringify(resources);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await dailyContent.upsert({
    where: { contentDate: today } as any,
    create: {
      contentDate: today,
      messageBody: messageBody.trim(),
      resources: resourcesJson,
      promptUsed: null,
    },
    update: {
      messageBody: messageBody.trim(),
      resources: resourcesJson,
      promptUsed: null,
    },
  } as any);
  return true;
}
