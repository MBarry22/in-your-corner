import { twilio, getTwilioFromNumber } from "./twilio";
import { prisma } from "./prisma";

export interface SendResult {
  success: boolean;
  twilioSid?: string;
  errorMessage?: string;
}

/** Ensure E.164: Twilio requires + prefix. */
function toE164(phone: string): string {
  const trimmed = (phone || "").trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export async function sendSms(to: string, body: string): Promise<SendResult> {
  const from = getTwilioFromNumber();
  if (!twilio || !from) {
    return { success: false, errorMessage: "Twilio not configured" };
  }

  const bodyTrimmed = (body || "").trim();
  if (!bodyTrimmed) {
    return { success: false, errorMessage: "Message body is empty" };
  }

  const toE164Number = toE164(to);
  if (!toE164Number) {
    return { success: false, errorMessage: "Recipient phone number is missing" };
  }

  try {
    const message = await twilio.messages.create({
      body: bodyTrimmed,
      from,
      to: toE164Number,
    });
    return { success: true, twilioSid: message.sid };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sms] send failed", { to: toE164Number, error: message });
    return { success: false, errorMessage: message };
  }
}

export async function sendAndLog(
  recipientId: string,
  to: string,
  body: string,
  templateId: string | null
): Promise<SendResult> {
  const result = await sendSms(to, body);
  await prisma.messageLog.create({
    data: {
      recipientId,
      templateId,
      bodySent: body,
      status: result.success ? "sent" : "failed",
      twilioSid: result.twilioSid ?? null,
      errorMessage: result.errorMessage ?? null,
      sentAt: new Date(),
    },
  });
  return result;
}
