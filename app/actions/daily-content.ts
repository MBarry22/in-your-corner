"use server";

import { ensureDailyContentForToday, generateOnlyTodayContent, saveTodayContent } from "@/lib/daily-content";
import { revalidatePath } from "next/cache";

export type GenerateResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export type PreviewResult =
  | { ok: true; content: { messageBody: string; resources: { id: string; title: string; url: string; note?: string }[] } }
  | { ok: false; error: string };

/**
 * Generate and store today's AI message + resources. Call from dashboard/settings.
 */
export async function generateTodayContent(
  customPrompt?: string
): Promise<GenerateResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { ok: false, error: "OPENAI_API_KEY not set." };
  }

  const content = await ensureDailyContentForToday(customPrompt, true);
  if (!content) {
    return {
      ok: false,
      error: "Generation failed. Check OPENAI_API_KEY and that USE_AI_DAILY_MESSAGE is set if needed.",
    };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/daily");
  return {
    ok: true,
    message: content.messageBody.slice(0, 100) + (content.messageBody.length > 100 ? "…" : ""),
  };
}

/**
 * Generate a new message + resources without saving. For testing/preview — click repeatedly to see different outputs.
 */
export async function generateTodayContentPreview(
  customPrompt?: string
): Promise<PreviewResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { ok: false, error: "OPENAI_API_KEY not set." };
  }

  const content = await generateOnlyTodayContent(customPrompt);
  if (!content) {
    return { ok: false, error: "Generation failed." };
  }

  return {
    ok: true,
    content: {
      messageBody: content.messageBody,
      resources: content.resources,
    },
  };
}

/**
 * Save the given message + resources as today's content (e.g. after preview).
 */
export async function saveTodayContentAction(
  messageBody: string,
  resources: { id: string; title: string; url: string; note?: string }[]
): Promise<GenerateResult> {
  const ok = await saveTodayContent(messageBody, resources);
  if (!ok) return { ok: false, error: "Save failed." };
  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/daily");
  return { ok: true, message: "Saved." };
}
