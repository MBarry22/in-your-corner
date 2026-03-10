import OpenAI from "openai";
import { SMS_MAX_LENGTH } from "./constants";
import { getResourcesForPrompt, getResourceById } from "./recovery-resources";

const apiKey = process.env.OPENAI_API_KEY;
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface DailyContentResult {
  message: string;
  resources: { id: string; title: string; url: string; note?: string }[];
}

function buildSystemPrompt(): string {
  const resourceList = getResourcesForPrompt();
  return `You are a warm, supportive voice for "In Your Corner" — a private daily support app that sends one short SMS per day to someone in alcohol recovery. Tone: warm, calm, non-judgmental. No medical or crisis advice.

MESSAGE RULES — make each day feel special and different:
- NEVER use generic phrases like: "Happy Monday/Tuesday/etc.", "new opportunity", "you've got strength", "keep moving forward", "embrace your journey", "positive choices", "you've got this", "one day at a time" (unless you rephrase it in a fresh way). Avoid anything that sounds like a repeating template.
- DO: Tie the message to something specific about the day (e.g. Monday = fresh start or gentle ease-in; Wednesday = midweek breath; Friday = wind-down; weekend = rest or connection). Use varied sentence structures: sometimes a single short line, sometimes a question, sometimes a quiet observation. Use concrete, simple words. Surprise them with a new angle each time — humour (gentle), metaphor, or a single kind observation. Keep it under ${SMS_MAX_LENGTH} characters.
- NUDGE (often but not every day): Suggest one small, healthy or positive thing they could do today — e.g. "Text someone you miss," "Get a coffee and sit outside for 10 minutes," "Take a short walk," "Do one thing you used to enjoy," "Reach out to a friend," "Step outside for a few breaths." Keep it brief and optional-sounding (invite, don't lecture). Vary these so it doesn't feel repetitive.
- If you mention the day of the week, use ONLY the exact day given in the user message.

RESOURCES: Pick 2–3 from the list below ONLY by id. Vary choices daily (different categories: helplines, support groups, reading, regional). Return each as {"id": "the-id", "note": "one short line"}. Do not invent URLs.

Curated resources (pick by id):
${resourceList}

Respond in JSON only, no markdown:
{"message": "Your message here.", "resources": [{"id": "aa", "note": "optional short note"}, ...]}`;
}

/**
 * Generate today's supportive message and optional resources using OpenAI.
 * todayLabel and dayOfWeek must be the actual Calgary day so the AI never says the wrong day.
 */
export async function generateDailyContent(
  customPrompt?: string,
  todayLabel?: string,
  dayOfWeek?: string
): Promise<DailyContentResult | null> {
  if (!openai) {
    console.warn("[openai] OPENAI_API_KEY not set; skipping AI generation.");
    return null;
  }

  const dateContext =
    todayLabel && dayOfWeek
      ? `CRITICAL – Calgary time: Today is ${todayLabel}. The day of the week is ${dayOfWeek}. You MUST use "${dayOfWeek}" (and only ${dayOfWeek}) if you mention the day. Do not use any other weekday name (e.g. do not say Wednesday, Tuesday, etc.). `
      : "";

  const userPrompt =
    customPrompt?.trim() ||
    `${dateContext}Write ONE short, fresh supportive message for someone in alcohol recovery — something that makes today feel distinct (not a generic pep talk). Then pick 2–3 resources by id. Output JSON only.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { message?: string; resources?: unknown[] };
    const message =
      typeof parsed.message === "string"
        ? parsed.message.trim().slice(0, SMS_MAX_LENGTH)
        : "";
    const resourcesRaw = Array.isArray(parsed.resources) ? parsed.resources : [];
    const resources: { id: string; title: string; url: string; note?: string }[] = [];
    for (const r of resourcesRaw) {
      if (r == null || typeof r !== "object") continue;
      const id = typeof (r as { id?: string }).id === "string" ? (r as { id: string }).id.trim() : "";
      const res = getResourceById(id);
      if (res) {
        resources.push({
          id: res.id,
          title: res.title,
          url: res.url,
          note: typeof (r as { note?: string }).note === "string" ? (r as { note: string }).note.slice(0, 120) : undefined,
        });
      }
    }

    if (!message) return null;

    return { message, resources };
  } catch (err) {
    console.error("[openai] generateDailyContent failed", err);
    return null;
  }
}
