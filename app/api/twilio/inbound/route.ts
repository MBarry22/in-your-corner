import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OPT_KEYWORDS = ["STOP", "START", "PAUSE", "RESUME", "HELP"] as const;

function normalizeBody(body: string): string {
  return body.trim().toUpperCase();
}

function detectOptAction(normalized: string): (typeof OPT_KEYWORDS)[number] | null {
  const word = normalized.split(/\s+/)[0];
  if (OPT_KEYWORDS.includes(word as (typeof OPT_KEYWORDS)[number])) {
    return word as (typeof OPT_KEYWORDS)[number];
  }
  return null;
}

export async function POST(req: NextRequest) {
  let fromPhone = "";
  let body = "";
  let twilioSid = "";

  try {
    const formData = await req.formData();
    fromPhone = (formData.get("From") as string) ?? "";
    body = (formData.get("Body") as string) ?? "";
    twilioSid = (formData.get("MessageSid") as string) ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const normalizedBody = normalizeBody(body);
  const optAction = detectOptAction(normalizedBody);

  const recipient = await prisma.recipient.findUnique({
    where: { phone: fromPhone },
  });

  await prisma.inboundMessage.create({
    data: {
      recipientId: recipient?.id ?? null,
      fromPhone,
      body,
      normalizedBody,
      optAction,
      twilioSid: twilioSid || null,
      receivedAt: new Date(),
    },
  });

  if (recipient && optAction) {
    if (optAction === "STOP" || optAction === "PAUSE") {
      await prisma.recipient.update({
        where: { id: recipient.id },
        data: { isPaused: true },
      });
    } else if (optAction === "START" || optAction === "RESUME") {
      await prisma.recipient.update({
        where: { id: recipient.id },
        data: { isPaused: false },
      });
    }
  }

  if (optAction === "HELP") {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>This is a daily support message. Reply STOP to pause, START to resume, or HELP for this message.</Message></Response>`;
    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (optAction === "STOP" || optAction === "PAUSE") {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You've been paused. Reply START when you'd like to receive messages again.</Message></Response>`;
    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (optAction === "START" || optAction === "RESUME") {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You're back on the list. We'll send your next message at your scheduled time.</Message></Response>`;
    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  return new NextResponse(null, { status: 200 });
}
