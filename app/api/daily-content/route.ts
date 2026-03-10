import { NextResponse } from "next/server";
import { getDailyContentForDate } from "@/lib/daily-content";
import { getAppTodayDate } from "@/lib/timezone";
import { getResourceById } from "@/lib/recovery-resources";

/**
 * GET /api/daily-content
 * Returns today's AI-generated message and resources (Calgary time). Optional ?date=YYYY-MM-DD.
 * Only curated resource URLs are returned so we never send broken or invented links.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const contentDate = dateParam
    ? new Date(dateParam + "T00:00:00.000Z")
    : getAppTodayDate();

  const content = await getDailyContentForDate(contentDate);
  if (!content) {
    return NextResponse.json({ content: null });
  }

  const raw = content.resources
    ? (JSON.parse(content.resources) as { id?: string; title?: string; url?: string; note?: string }[])
    : [];
  const resources = raw.map((r) => {
    const curated = r.id ? getResourceById(r.id) : undefined;
    if (curated) {
      return { id: curated.id, title: curated.title, url: curated.url, note: r.note };
    }
    return { title: r.title || r.id || "Resource", note: r.note };
  });

  return NextResponse.json({
    content: {
      contentDate: content.contentDate.toISOString().slice(0, 10),
      messageBody: content.messageBody,
      resources,
      promptUsed: content.promptUsed,
      updatedAt: content.updatedAt.toISOString(),
    },
  });
}
