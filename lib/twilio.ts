import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.warn("Twilio credentials not set; SMS sending will fail.");
}

export const twilio =
  accountSid && authToken
    ? Twilio(accountSid, authToken)
    : null;

export function getTwilioFromNumber(): string | null {
  return fromNumber ?? null;
}

// TODO: Verify Twilio request signature using TWILIO_WEBHOOK_AUTH_TOKEN or Twilio's validateRequest
export function verifyTwilioSignature(
  _url: string,
  _params: Record<string, string>,
  _signature: string
): boolean {
  return true;
}
