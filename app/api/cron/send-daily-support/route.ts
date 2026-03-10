import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRecipientDue } from "@/lib/timezone";
import { selectMessageForRecipient } from "@/lib/message-selector";
import { sendAndLog } from "@/lib/sms";
import { ensureDailyContentForToday } from "@/lib/daily-content";
import { formatInTimeZone } from "date-fns-tz";

const CRON_SECRET = process.env.CRON_SECRET;

/** Sends run every 15 min; recipients with send time 8:00 AM Calgary (America/Edmonton) get their message in that window. */

function authCron(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.replace(/^Bearer\s+/i, "") ?? null;
  const querySecret = req.nextUrl.searchParams.get("secret");
  const secret = bearer ?? querySecret;
  return !!CRON_SECRET && secret === CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!authCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const summary = {
    recipientsChecked: 0,
    dueRecipients: [] as string[],
    messagesSent: 0,
    skipped: 0,
    failures: 0,
  };

  const activeRecipients = await prisma.recipient.findMany({
    where: { isActive: true, isPaused: false },
    select: {
      id: true,
      name: true,
      phone: true,
      timezone: true,
      sendHour: true,
      sendMinute: true,
    },
  });

  summary.recipientsChecked = activeRecipients.length;

  // Always generate a fresh message for today (Calgary date) before sending, so the 8 AM send uses
  // a message that says the correct day/date (e.g. Tuesday, not Monday’s leftover).
  if (process.env.USE_AI_DAILY_MESSAGE === "true" && process.env.OPENAI_API_KEY) {
    await ensureDailyContentForToday(undefined, true);
  }

  for (const r of activeRecipients) {
    const window = {
      recipientId: r.id,
      timezone: r.timezone,
      sendHour: r.sendHour,
      sendMinute: r.sendMinute,
    };
    if (!isRecipientDue(window, now)) {
      summary.skipped++;
      continue;
    }

    const dateStr = formatInTimeZone(now, r.timezone, "yyyy-MM-dd");
    const sentDate = new Date(dateStr + "T00:00:00.000Z");

    const existingLock = await prisma.dailySendLock.findUnique({
      where: {
        recipientId_sentDate: { recipientId: r.id, sentDate },
      },
    });
    if (existingLock) {
      summary.skipped++;
      continue;
    }

    summary.dueRecipients.push(r.id);

    const selected = await selectMessageForRecipient(r.id);
    if (!selected) {
      summary.failures++;
      await prisma.messageLog.create({
        data: {
          recipientId: r.id,
          templateId: null,
          bodySent: "",
          status: "failed",
          errorMessage: "No active message template available",
          sentAt: now,
        },
      });
      continue;
    }

    const result = await sendAndLog(r.id, r.phone, selected.body, selected.templateId);

    if (result.success) {
      await prisma.dailySendLock.create({
        data: { recipientId: r.id, sentDate },
      });
      summary.messagesSent++;
    } else {
      summary.failures++;
    }
  }

  return NextResponse.json(summary);
}
