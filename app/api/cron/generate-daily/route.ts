import { NextRequest, NextResponse } from "next/server";
import { ensureDailyContentForToday } from "@/lib/daily-content";

const CRON_SECRET = process.env.CRON_SECRET;

function authCron(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.replace(/^Bearer\s+/i, "") ?? null;
  const querySecret = req.nextUrl.searchParams.get("secret");
  const secret = bearer ?? querySecret;
  return !!CRON_SECRET && secret === CRON_SECRET;
}

/**
 * GET /api/cron/generate-daily
 * Generates and stores today's AI message + resources. Call once per day (e.g. before send window).
 * Optional query: ?prompt=... for a custom prompt.
 */
export async function GET(req: NextRequest) {
  if (!authCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set" },
      { status: 500 }
    );
  }

  const prompt = req.nextUrl.searchParams.get("prompt") ?? undefined;
  const content = await ensureDailyContentForToday(prompt);

  if (!content) {
    return NextResponse.json(
      { error: "Generation failed or USE_AI_DAILY_MESSAGE not enabled", content: null },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: content.messageBody.slice(0, 80) + (content.messageBody.length > 80 ? "…" : ""),
    resources: content.resources ? JSON.parse(content.resources) : [],
  });
}
