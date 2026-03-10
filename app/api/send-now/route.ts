import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectMessageForRecipient } from "@/lib/message-selector";
import { sendAndLog } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const { recipientId, test } = await req.json();
    if (!recipientId || typeof recipientId !== "string") {
      return NextResponse.json({ error: "recipientId required" }, { status: 400 });
    }

    const recipient = await prisma.recipient.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }
    if (!recipient.isActive) {
      return NextResponse.json({ error: "Recipient is inactive" }, { status: 400 });
    }

    let body: string;
    let templateId: string | null;

    if (test) {
      body = "This is a test message from In Your Corner. You're set up!";
      templateId = null;
    } else {
      const selected = await selectMessageForRecipient(recipientId);
      if (!selected) {
        return NextResponse.json(
          { error: "No active message template available. Add message templates or generate today's AI message on the dashboard." },
          { status: 400 }
        );
      }
      body = (selected.body || "").trim();
      templateId = selected.templateId;
      if (!body) {
        return NextResponse.json(
          { error: "Selected message body is empty. Generate today's message on the dashboard or add templates." },
          { status: 400 }
        );
      }
    }

    const result = await sendAndLog(recipientId, recipient.phone, body, templateId);

    if (result.success) {
      return NextResponse.json({
        ok: true,
        twilioSid: result.twilioSid,
        message: "Message sent",
      });
    }
    const message =
      result.errorMessage?.includes("Mismatch") ||
      result.errorMessage?.toLowerCase().includes("from")
        ? "Twilio: The 'From' number in .env doesn't belong to your Twilio account. In Twilio Console, use a number from this account for TWILIO_PHONE_NUMBER, or use the Account SID/Token for the account that owns that number."
        : result.errorMessage ?? "Send failed";
    return NextResponse.json(
      { error: "Send failed", details: result.errorMessage, message },
      { status: 500 }
    );
  } catch (err) {
    console.error("[send-now]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
